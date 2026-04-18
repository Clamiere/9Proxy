# Data Pipeline — Adding Programs at Scale

The canonical 8-step flow for importing affiliate programs into the registry.
Use this as the operational playbook for any batch import session.

> **Companion docs**
> - [sources.md](./sources.md) — where to discover new programs
> - [discovery-keywords.md](./discovery-keywords.md) — how to detect that a program exists

---

## The 8 Steps

```
 0. Dedup check         ← NEW (before touching YAML)
 1. YAML creation
 2. Logo download
 3. Signup URL enrichment
 4. Data validation audit
 5. URL verification
 6. Build registry
 7. Freshness tracking   ← NEW (post-merge cron)
```

### Step 0 — Dedup check (before import)

Before creating any YAML, compare the candidate list against `src/lib/registry.json`:

```bash
# Candidate list: candidates.txt (one domain per line)
python3 -c "
import json
existing = {p['url'].rstrip('/').replace('https://','').replace('http://','').lower()
            for p in json.load(open('src/lib/registry.json'))['programs']}
existing_slugs = {p['slug'] for p in json.load(open('src/lib/registry.json'))['programs']}
with open('candidates.txt') as f:
    for line in f:
        d = line.strip().lower().rstrip('/')
        if any(d.endswith(e) or e.endswith(d) for e in existing):
            print(f'DUPLICATE: {d}')
"
```

**Why:** 89% of current programs come from PartnerStack. Re-syncing without dedup creates mass duplicates.

### Step 1 — YAML creation

Create `programs/{slug}.yaml` per `schema/program.schema.json`. See
[CONTRIBUTING.md](../CONTRIBUTING.md#yaml-template) for the template.

**Required fields:** `name`, `slug`, `url`, `category`, `commission`, `cookie_days`, `payout`, `signup_url`, `description`, `short_description`, `agents`.

**Also record** (recommended additions — see "Schema evolution" below):
- `source`: which discovery channel (`partnerstack-api`, `product-hunt`, `yc-directory`, `reditus`, `manual`, etc.)
- `last_verified_at`: ISO date of last URL verification

Validate immediately:

```bash
npm run registry:build   # runs scripts/build-registry.ts
```

### Step 2 — Logo download

Logos live in `public/logos/{slug}.{ext}`. Fallback chain: apple-touch-icon → favicon.ico → Google Favicon API.

> **Note:** The memory index references `scripts/download-logos.ts`, but that script does not exist in-repo yet. Until it lands, logos are fetched manually or via the web-form submit flow. If you batch-import, write logos out with a one-off script in the session and delete it after — do not commit ad-hoc scripts.

### Step 3 — Signup URL enrichment

The `signup_url` must point to the actual affiliate signup page, not the product homepage.

**Fast path (HTML scrape):**
- Fetch the program homepage
- Scan `<a href>` for affiliate keyword patterns (see [discovery-keywords.md](./discovery-keywords.md))
- Follow the top-scored link; confirm it's an affiliate signup page

**Fallback (AI crawl, for ~15% of cases):**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto https://example.com
$B text                # extract visible text
$B snapshot -i         # get interactive elements with @refs
```

Use 5 parallel sub-agents, ~8 sites each.

### Step 4 — Data validation audit

After any batch add, run:

```bash
python3 -c "
import json
d = json.load(open('src/lib/registry.json'))
programs = d['programs']

# Duplicate slugs
slugs = [p['slug'] for p in programs]
dup_slugs = [s for s in slugs if slugs.count(s) > 1]
print('Dup slugs:', set(dup_slugs) or 'none')

# Duplicate URLs
urls = [p['url'].rstrip('/').lower() for p in programs]
dup_urls = [u for u in urls if urls.count(u) > 1]
print('Dup URLs:', set(dup_urls) or 'none')

# Non-standard networks
nets = {p.get('network') for p in programs if p.get('network')}
bad = [n for n in nets if n != n.lower().replace(' ', '-')]
print('Non-standard networks:', bad or 'none')

# Approval values
approvals = {p.get('approval') for p in programs}
print('Approval values:', approvals)

# Singleton categories
from collections import Counter
cats = Counter(p['category'] for p in programs)
singletons = [(c,n) for c,n in cats.items() if n <= 2]
print('Singleton categories:', singletons or 'none')
"
```

**Data standards:**

| Field | Format | Examples |
|---|---|---|
| `network` | lowercase, hyphenated | `partnerstack`, `cj-affiliate`, `in-house`, `dub` |
| `approval` | `auto` or `manual` | never `automatic` |
| `commission.rate` | string | `25%`, `$100`, `20-30%`, `varies` |
| `category` | Title Case, from allowlist | see below |
| `created_at` | ISO date | `2026-04-18` |

**Category allowlist (enforce — current drift):**
`AI`, `Analytics`, `Business Operations`, `Communication`, `Content Management`, `CRM`, `Customer Support`, `Design`, `Developer Tools`, `E-Commerce`, `Email Marketing`, `Finance`, `HR & Recruiting`, `Infrastructure`, `Marketing`, `Productivity`, `Sales`, `SaaS`, `Security`, `Social Media`.

> **Known drift:** registry has 20 categories today vs. the 17 target in early docs. Pick one set and enforce via schema `enum`.

### Step 5 — URL verification

```bash
npm run verify                          # all programs
npm run verify:changed                  # CI mode — only changed files
npx tsx scripts/verify-programs.ts stripe   # single program
```

> Package.json also lists `verify:deep` / `verify:deep:unverified`, but `scripts/verify-deep.ts` is **missing**. Either land that script or remove the npm entries.

### Step 6 — Build + push

```bash
npm run build                           # prebuild rebuilds registry.json
git add programs/ src/lib/registry.json public/logos/
git commit -m "data: add {N} {source} programs"
# → PR to main; CI verifies changed files
```

### Step 7 — Freshness tracking (post-merge)

AI startups pivot or die fast. Stale data erodes trust.

- Weekly cron: re-verify `last_verified_at > 30 days` programs
- Monthly cron: re-sync PartnerStack API, diff against registry, open PR with delta
- Quarterly: remove programs that 404 three checks in a row

---

## Timing & Batch Sizing

Measured per-program costs (approximate):

| Step | Structured (API) | Semi-structured (marketplace) | Unstructured (launch page) |
|---|---|---|---|
| YAML creation | ~5s | ~30s | ~60s (LLM extract) |
| Logo download | ~3s | ~3s | ~5s |
| Signup URL enrich | 0s (already in API) | ~5s scrape | ~25s (AI crawl) |
| URL verify | ~2s | ~2s | ~3s |
| **Per-program total** | **~10s** | **~40s** | **~90s** |

Batch overhead (once per run): dedup ~1s, validate ~5s, build ~10s, commit/push ~5s = **~20s fixed**.

### Throughput per session

A single focused Claude Code session (~2-3 hours of effective work before context gets heavy) can complete end-to-end:

| Source profile | Programs per session | Recommended batch size per PR |
|---|---|---|
| Structured API (PartnerStack delta, CJ) | **200-400** | 50-100 per PR |
| Semi-structured (Reditus, Dub, Rewardful marketplace) | **80-150** | 30-50 per PR |
| Unstructured (Product Hunt, YC, HN "Show HN") | **30-60** | 15-25 per PR |

### Can one session do steps 0 → 6 end-to-end?

**Yes**, provided:
- Batch stays ≤ 50 programs for semi/unstructured sources (review fatigue)
- Batch can go up to ~100 for structured API imports (less judgment per item)
- You pre-commit to **one source per session** — don't mix PartnerStack + Product Hunt in the same PR

Step 7 (freshness) is **always async** — it's a scheduled cron, never part of an import session.

### Anti-patterns

- ❌ One PR with 300 programs → reviewer abandons
- ❌ Mixing structured + unstructured sources in one PR → hard to QA
- ❌ Skipping Step 0 after PartnerStack already imported → silent duplicates
- ❌ Importing without `source` field → can't refresh that channel later

---

## Scaling to 1000+ Programs

For volumes beyond hand-curation:

1. **Discovery API**: Firecrawl ($19/mo, 3000 pages) or Apify for structured scrapes
2. **Extraction**: `claude-haiku-4-5` ~$0.001/page → $1 per 1000 programs
3. **Pipeline shape**:
   ```
   homepage HTML → regex-score affiliate link
                 → fetch affiliate page HTML
                 → Claude API structured extract
                 → schema validate → write YAML
   ```
4. **Rate limiting**: 5 concurrent requests, 500ms between batches

---

## Schema evolution notes

These fields are referenced in this pipeline but may not yet be in `schema/program.schema.json`. Land them before the next large batch:

- `source` (string enum) — attribution for refresh cadence
- `last_verified_at` (ISO date) — freshness
- `completeness_score` (0-100, computed at build) — quality tier UI signal
- `category` as `enum` (from allowlist) — prevent drift
