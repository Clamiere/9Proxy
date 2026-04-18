/**
 * Affiliate Score v1 — transparent public formula.
 *
 * Total out of 100. Inputs are all publicly visible in the YAML registry,
 * so anyone can reproduce the score locally. v2 (in @openaffiliate/scoring-pro)
 * adds proprietary signals: EPC, trust, approval rate.
 *
 * Formula:
 *   commissionValue : 0-40  (rate × type magnitude)
 *   cookieScore     : 0-15  (cookie_days / 90, capped)
 *   typeBonus       : 0-25  (recurring > hybrid > tiered > one-time)
 *   verifiedBonus   : 0-10  (binary)
 *   completeness    : 0-10  (description, agent prompt, signup_url presence)
 */

export interface ScoreInput {
  commission: {
    type?: "one-time" | "recurring" | "tiered" | "hybrid" | null
    rate?: string | number | null
    duration?: string | null
    recurring_period?: string | null
  } | null
  cookie_days?: number | null
  verified?: boolean
  description?: string | null
  short_description?: string | null
  agents?: { prompt?: string | null } | null
  signup_url?: string | null
}

export interface ScoreBreakdown {
  commissionValue: number
  cookieScore: number
  typeBonus: number
  verifiedBonus: number
  completeness: number
}

export interface ScoreResult {
  total: number
  breakdown: ScoreBreakdown
  tier: "S" | "A" | "B" | "C" | "D"
}

export function computeScoreV1(input: ScoreInput): ScoreResult {
  const commissionValue = scoreCommissionValue(input.commission)
  const cookieScore = scoreCookie(input.cookie_days)
  const typeBonus = scoreTypeBonus(input.commission)
  const verifiedBonus = input.verified ? 10 : 0
  const completeness = scoreCompleteness(input)

  const total = round(commissionValue + cookieScore + typeBonus + verifiedBonus + completeness)

  return {
    total,
    breakdown: { commissionValue, cookieScore, typeBonus, verifiedBonus, completeness },
    tier: tierOf(total),
  }
}

function scoreCommissionValue(c: ScoreInput["commission"]): number {
  if (!c || !c.rate) return 5
  const rate = String(c.rate)
  // Percentage: e.g. "30%"
  const pctMatch = rate.match(/(\d+(?:\.\d+)?)\s*%/)
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1])
    return Math.min(40, (pct / 50) * 40)
  }
  // Dollar amount: e.g. "$50", "$500+"
  const dollarMatch = rate.match(/\$(\d+)/)
  if (dollarMatch) {
    const amt = parseInt(dollarMatch[1], 10)
    if (amt >= 500) return 40
    if (amt >= 100) return 28
    if (amt >= 50) return 16
    if (amt >= 1) return 8
    return 5
  }
  if (/varies/i.test(rate)) return 15
  return 5
}

function scoreCookie(days: number | null | undefined): number {
  if (!days || days <= 0) return 0
  return Math.min(15, (days / 90) * 15)
}

function scoreTypeBonus(c: ScoreInput["commission"]): number {
  if (!c?.type) return 5
  const dur = (c.duration ?? c.recurring_period ?? "").toLowerCase()
  if (c.type === "recurring") {
    if (dur.includes("lifetime")) return 25
    if (dur.includes("24")) return 23
    if (dur.includes("12")) return 21
    return 18
  }
  if (c.type === "hybrid") return 15
  if (c.type === "tiered") return 12
  if (c.type === "one-time") return 5
  return 5
}

function scoreCompleteness(input: ScoreInput): number {
  let pts = 0
  const desc = input.description ?? input.short_description ?? ""
  if (desc.length > 20) pts += 4
  const agentPrompt = input.agents?.prompt ?? ""
  if (agentPrompt.length > 10) pts += 3
  if (input.signup_url && input.signup_url.length > 0) pts += 3
  return pts
}

function round(n: number): number {
  return Math.round(n * 10) / 10
}

function tierOf(total: number): ScoreResult["tier"] {
  if (total >= 85) return "S"
  if (total >= 70) return "A"
  if (total >= 55) return "B"
  if (total >= 40) return "C"
  return "D"
}
