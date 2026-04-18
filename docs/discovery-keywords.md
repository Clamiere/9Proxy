# Discovery Keywords — Detecting Affiliate Programs

Companies call their affiliate program **many things**. Searching only for the literal string `"affiliate program"` misses a large fraction of real programs — especially modern SaaS/AI startups that deliberately avoid the word "affiliate" (it sounds spammy/B2C to their ICP).

This doc is the canonical keyword + heuristic catalog for deciding "does this company have a program?".

> **Used by**: Step 1 YAML creation, Step 3 signup URL enrichment, and any discovery scraper.

---

## Program naming — what companies actually call it

Weight-ranked (higher = stronger signal):

### Tier 1 — direct (near-certain match)
- `affiliate program`
- `referral program`
- `partner program`
- `partnership program`
- `ambassador program`
- `reseller program`

### Tier 2 — common modern rebrands
- `creator program` (content creators, AI media tools)
- `advocate program` (B2B SaaS, enterprise)
- `champion program`
- `influencer program` (consumer AI tools)
- `expert program`
- `power user program`

### Tier 3 — revenue-sharing language
- `revenue share` / `rev share` / `rev-share`
- `commission`
- `earn {XX}%` / `earn per referral`
- `get paid to refer`
- `share and earn`
- `refer and earn`
- `payout` (in nav/footer context)

### Tier 4 — soft-signal (confirm manually)
- `refer a friend` / `refer friends`
- `invite friends`
- `bring a friend`
- `introduce {product}`
- `recommend {product}`
- `spread the word`
- `share {product}` + monetary CTA
- `join our community` + revenue mention
- `become a partner`
- `work with us` (sometimes affiliate, sometimes reseller)

### Tier 5 — enterprise & channel variants
- `channel partner`
- `solution partner`
- `integration partner` (rarely paid; verify)
- `agency partner`
- `consultant program`
- `VAR program` (value-added reseller)
- `technology partner` (usually co-marketing, not commission)

---

## URL patterns — where the page lives

Check these paths on the company homepage (in priority order):

```
/affiliate                /affiliates
/partner                  /partners                 /partnership
/refer                    /referral                 /referrals
/ambassador               /ambassadors
/creators                 /creator-program
/advocates                /advocate
/reseller                 /resellers
/earn                     /earn-with-us
/share                    /invite
/become-a-partner         /join                     /join-us
```

### Third-party network URL patterns

If the company uses an external platform, detect via these:

```
partnerstack.com/         → PartnerStack
app.impact.com/           → Impact
rewardful.com/            → Rewardful
tolt.io/                  → Tolt
firstpromoter.com/        → FirstPromoter
tapfiliate.com/           → Tapfiliate
getdub.com/ | d.to/       → Dub
cj.com/ | cj.affiliate    → CJ Affiliate
shareasale.com/           → ShareASale
awin1.com/                → Awin
impact.com/c/             → Impact (hosted)
leaddyno.com/             → LeadDyno
postaffiliatepro.com/     → Post Affiliate Pro
trackdesk.com/            → Trackdesk
```

---

## Page-content signals (when you fetch the affiliate page)

Strong confirmation that it's a real program (not just a "recommend us" blurb):

### Monetary signals
- Percentage: `30%`, `20-30%`, `up to 40%` near words like "commission", "payout", "earn"
- Fixed amount: `$100 per signup`, `$50 per conversion`
- Recurring language: `recurring commission`, `lifetime commission`, `{N} months`

### Operational signals
- `cookie duration` / `attribution window` / `tracking window`
- `minimum payout` / `payout threshold`
- `payout methods` + any of `PayPal`, `Stripe`, `wire`, `ACH`, `bank transfer`
- `dashboard`, `affiliate dashboard`, `partner portal`
- `approval process`, `review`, `apply now`, `join now`
- `marketing materials`, `assets`, `banners`, `swipe copy`

### Program structure
- `tiers` / `levels` + percentage progression
- `bonuses`, `SPIFs`, `incentives`
- `promotion periods`, `seasonal`

### Dead giveaways it's **not** a program
- Only "spread the word on social" with no commission
- "Become a partner" that's actually an integration directory
- "Become a reseller" with $10K+ minimum (that's a B2B reseller, not affiliate)
- "Press / PR" — media-only page

---

## Search strategy (discovery phase)

When hunting for new programs, run these queries **in combination** per candidate company:

### Google / site-specific search

```
site:{company.com} affiliate
site:{company.com} partner
site:{company.com} referral
site:{company.com} "earn" commission
site:{company.com} ambassador
"{company}" + "partnerstack"
"{company}" + "rewardful"
"{company}" + "commission" + "cookie"
```

### Web search (cross-site discovery)

```
"{company}" affiliate program
"{company}" referral program -reddit  # exclude low-signal
"{company}" "partnerstack"
"{company}" "apply" "commission"
"affiliate program" "AI" "SaaS" 2026   # fresh programs
```

### Footer / sitemap / robots.txt checks

1. `GET {company.com}/robots.txt` — scan for `/affiliate`, `/partners`
2. `GET {company.com}/sitemap.xml` — same
3. Fetch homepage HTML, regex footer `<a>` tags for the URL patterns above

### Third-party signal

- Is the company listed on `partnerstack.com/marketplace`?
- Is there a `rewardful.com/{slug}` page?
- Is there a `dub.co/{slug}` affiliate subdomain?

---

## Scoring heuristic

When a scraper evaluates a candidate link, score it before following:

| Signal | Points |
|---|---|
| URL path matches Tier-1 pattern (`/affiliate`, `/partners`) | +10 |
| URL path matches Tier-2 pattern (`/creators`, `/ambassadors`) | +7 |
| Anchor text in Tier-1 keyword set | +10 |
| Anchor text in Tier-2 keyword set | +6 |
| Anchor text in Tier-3 keyword set | +3 |
| Link points to known network (partnerstack, impact, rewardful, etc.) | +15 |
| Link is in footer (vs. nav/body) | +2 |
| Link anchor contains `%` or `$` | +5 |
| Link goes to `/api/`, `/docs/`, `/blog/` | −5 (noise) |

**Threshold**: score ≥ 8 → follow and extract. Score 4-7 → flag for manual review. Score < 4 → skip.

---

## False positives to guard against

These words appear in affiliate contexts but often mean something else:

| Word | Often means | Affiliate only when... |
|---|---|---|
| `partner` | integration/tech partner | page mentions commission / payout |
| `refer` | "refer to documentation" | near a monetary CTA |
| `earn` | gamification / points | explicitly linked to payout |
| `share` | social share button | "share and earn $X" |
| `community` | Discord/forum | has revenue-share mention |
| `creator` | content creator tools | dedicated program with payout |

Rule of thumb: **a real affiliate program will mention both (a) a percentage or dollar amount, and (b) a payout mechanism** on the same page. Missing either → verify manually before adding.

---

## Localization notes

If searching non-English markets (future), add:

- Spanish: `programa de afiliados`, `programa de socios`, `referir`, `ganar comisión`
- French: `programme d'affiliation`, `programme partenaire`, `parrainage`
- German: `Partnerprogramm`, `Affiliate-Programm`, `Empfehlungsprogramm`
- Portuguese: `programa de afiliados`, `programa de parceria`
- Vietnamese: `chương trình tiếp thị liên kết`, `chương trình đối tác`, `giới thiệu`

---

## Updating this document

Add a keyword/pattern to this catalog when:
- You find a program that slipped through the scoring heuristic
- A new network launches with a distinctive URL pattern
- A vertical starts using a consistent rebrand (e.g., "creator program" surge in AI media)

Record the source program in the PR description so we can trace why the keyword was added.
