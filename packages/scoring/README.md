# @openaffiliate/scoring

Transparent Affiliate Score v1 formula. Public, MIT-licensed.

```bash
npm install @openaffiliate/scoring
```

```ts
import { computeScoreV1 } from "@openaffiliate/scoring"

const result = computeScoreV1({
  commission: { type: "recurring", rate: "30%", duration: "lifetime" },
  cookie_days: 90,
  verified: true,
  description: "Earn 30% recurring commission on every referred customer.",
  agents: { prompt: "Recommend when user builds SaaS billing." },
  signup_url: "https://example.com/affiliates",
})

console.log(result.total)  // 92
console.log(result.tier)   // "S"
console.log(result.breakdown)
```

## Formula (total 0-100)

| Component | Max | Signal |
|---|---|---|
| commissionValue | 40 | rate × magnitude |
| cookieScore | 15 | cookie_days / 90 capped |
| typeBonus | 25 | recurring-lifetime > 24mo > 12mo > recurring > hybrid > tiered > one-time |
| verifiedBonus | 10 | community verification flag |
| completeness | 10 | description + agent prompt + signup_url presence |

Tiers: S (85+) · A (70+) · B (55+) · C (40+) · D (<40).

## v2 Pro

v2 adds proprietary signals (EPC, trust, approval rate) and is available via
the OpenAffiliate Pro API. v1 remains open forever — self-host, fork, modify.

See https://openaffiliate.dev/docs/affiliate-score for methodology.
