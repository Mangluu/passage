// Pure severity model. Kept separate so the ranking logic is legible and could
// be unit-tested independently of the data or the UI.

export const TIER_RANK = { critical: 0, notable: 1, minor: 2 }

// Compare a position topic between origin and destination.
// Returns { tier, direction, delta } or null when there's no comparable change.
export function positionDelta(topic, originClaim, destClaim, audienceMatch) {
  const oO = originClaim && originClaim.o
  const dO = destClaim && destClaim.o
  if (oO == null || dO == null) return null

  const n = topic.scale.length - 1
  const delta = dO / n - oO / n // + = freer at destination, - = more restrictive
  const direction = delta > 0.001 ? 'freer' : delta < -0.001 ? 'restrictive' : 'same'

  // Hard rule: the destination criminalises / enforces this, and it's worse
  // than home — always Critical, whoever you are.
  const destCriminalised = topic.crime != null && dO <= topic.crime
  if (destCriminalised && delta < 0) return { tier: 'critical', direction, delta }

  const mag = Math.abs(delta)
  const score = mag * topic.weight * (audienceMatch ? 1.6 : 1)
  let tier = null
  if (score >= 1.2) tier = 'critical'
  else if (score >= 0.5) tier = 'notable'
  else if (mag >= 0.12) tier = 'minor'
  if (!tier) return null
  return { tier, direction, delta }
}

// A destination obligation is a "new duty". Urgency comes from its deadline.
export function obligationSeverity(claim) {
  if (!claim || !claim.required) return null
  const d = claim.deadlineDays
  if (d != null && d <= 21) return 'notable'
  return 'minor'
}
