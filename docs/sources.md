# Program Discovery Sources

Where to find affiliate programs to add to OpenAffiliate. Organized by reliability and fit for our positioning (SaaS + AI-native).

> **Pipeline**: see [data-pipeline.md](./data-pipeline.md) for how to import once discovered.
> **Detection**: see [discovery-keywords.md](./discovery-keywords.md) for how to confirm a company actually runs an affiliate program.

---

## Tier 1 — Structured APIs (highest ROI)

### PartnerStack API
- **URL**: `developers.partnerstack.com`
- **Signup**: free partner account
- **Endpoint**: `GET /api/v2/marketplace/programs?category=artificial-intelligence`
- **Coverage**: 500+ total, 149 AI-tagged
- **Fit**: B2B SaaS, AI category is first-class
- **Caveat**: already 310 programs from this source in registry → **use for delta only, never re-import wholesale**
- **Cadence**: monthly cron, diff-only

### CJ Advertiser Lookup API
- **URL**: `developers.cj.com`
- **Signup**: publisher account required
- **Data**: includes EPC and conversion rates (unique — nobody else has this)
- **Coverage**: 7,000+ advertisers, SaaS subset ~200
- **Fit**: Medium — CJ skews retail/ecommerce; the SaaS subset is mostly big incumbents

### Impact.com
- **URL**: `impact.com`
- **Signup**: free partner account → OAuth2 API
- **Coverage**: 2000+ programs, AI subset ~20
- **Fit**: High for enterprise SaaS

### Awin
- **URL**: `awin.com`
- **Signup**: free publisher account → OAuth2 API
- **Fit**: Low — retail-heavy, minimal SaaS native

---

## Tier 2 — SaaS-native marketplaces (scrape)

### Reditus
- **URL**: `app.getreditus.com/marketplace`
- **Coverage**: 6,000+ affiliates, hundreds of programs
- **Fit**: **Top priority** — pure B2B SaaS, complements PartnerStack skew

### Dub.co Partners
- **URL**: `dub.co/partners` (public listing)
- **Fit**: High — AI-first startups are concentrating here; new network, fresh data

### Rewardful Marketplace
- **URL**: `rewardful.com/marketplace`
- **Fit**: High — indie/small SaaS, many AI wrappers

### Tolt Marketplace
- **URL**: `tolt.io`
- **Fit**: Medium — Rewardful competitor, growing

### FirstPromoter Public Directory
- **URL**: `firstpromoter.com`
- **Fit**: Has dedicated "AI Tools" category

### Lemon Squeezy Affiliate Marketplace
- **URL**: `lemonsqueezy.com`
- **Fit**: Indie AI/SaaS, Stripe-alternative crowd

---

## Tier 3 — Launch & discovery (AI-native fresh)

Best for "new AI tool just launched" positioning. High noise, high signal on bleeding edge.

### Product Hunt
- **URL**: `producthunt.com/topics/artificial-intelligence`
- **Cadence**: 5-10 AI launches/day
- **Access**: API or scrape
- **Fit**: **Top priority** — matches our "discover new" positioning
- **Tip**: filter launches past 90 days, then detect affiliate via [discovery-keywords.md](./discovery-keywords.md)

### Y Combinator Company Directory
- **URL**: `ycombinator.com/companies?tags=AI`
- **Coverage**: 4,000+ companies, AI subset ~500
- **Fit**: High signal, high quality — but only ~10-15% have affiliate programs
- **Tip**: focus on batches S24 / W25 / S25 for freshness

### Hacker News "Show HN"
- **URL**: `news.ycombinator.com/shownew`
- **Filter**: keywords `AI`, `LLM`, `agent`, `copilot`
- **Fit**: Many indie launches have affiliate programs but aren't listed anywhere

### BetaList + Launching Next + Uneed.best
- **URLs**: `betalist.com`, `launchingnext.com`, `uneed.best`
- **Fit**: Pre-launch / early-stage

### theresanaiforthat.com
- **URL**: `theresanaiforthat.com`
- **Fit**: Largest AI directory; cross-reference for affiliate link presence

### futuretools.io
- **URL**: `futuretools.io`
- **Fit**: Matt Wolfe's curated list, quality-filtered

---

## Tier 4 — AI infra & dev tools (niche, high commission)

### OpenRouter, Replicate, Fal, Modal
- AI infrastructure providers; partner programs are new and often generous
- Usage-based commissions → high LTV per referral

### Vercel AI Integrations Marketplace
- Vendors listed there often have partner programs

### a16z Marketplace Directory
- Portfolio AI companies; many have affiliate

### Scale AI, Labelbox
- Data/ops layer — enterprise-scale affiliate payouts

---

## Tier 5 — Aggregator directories (cross-reference only)

Quality varies; use to **verify/enrich** existing candidates, not as primary discovery.

| Source | Note |
|---|---|
| `aiaffiliateprograms.ai` | AI-specialized, 20+ per network |
| `affiliate.watch` | Reviews + commission data |
| `getlasso.co/niche/ai` | Curated AI list, updated frequently |

---

## Tier 6 — Vertical deep-dives

When a tier is saturated, mine specific verticals:

| Vertical | Candidates to check |
|---|---|
| AI sales | Clay, Apollo, Lavender, Regie.ai, Outreach, Salesloft |
| AI coding | Cursor, Codeium, Continue, Tabnine, Sourcegraph |
| AI design | Figma AI plugins, Galileo AI, Uizard, Framer |
| AI video/audio | Descript, Pictory, ElevenLabs, Runway, HeyGen |
| AI writing | Jasper, Copy.ai, Writesonic, Anyword |
| AI agents | Crew AI, LangChain, LlamaIndex, AutoGPT ecosystem |

---

## Priority order (current roadmap)

**Sprint A — harden & delta (1-2 days)**
1. Schema evolution (add `source`, `last_verified_at`)
2. PartnerStack API delta re-sync
3. Category allowlist enforcement

**Sprint B — AI-native push (+150 programs)**
1. Product Hunt AI topic (last 90 days) → ~50
2. YC AI batches S24/W25/S25 → ~30
3. Dub + Rewardful + Tolt marketplaces → ~70

**Sprint C — quality tier (+100 programs)**
1. AI infra layer (OpenRouter/Replicate/Fal/Modal/etc.) → ~20
2. theresanaiforthat top 500 cross-reference → ~50
3. Vertical deep-dives (coding/design/video/sales) → ~40

**Target state after C:** 349 → ~600 programs, AI 41 → 200+, verified 14% → 40%, PartnerStack share 89% → <60%.

---

## Updating this document

When adding a new source:
- Which tier does it belong to?
- What's the typical coverage and fit?
- Does it need account signup? API or scrape?
- Any caveat (duplication risk, quality variance, retail skew)?

Keep entries one-paragraph terse. Detailed runbooks go in per-source scripts, not here.
