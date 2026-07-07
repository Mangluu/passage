// Read layer over src/data/emergency.json — emergency telephone numbers per
// country (see scripts/fetch-emergency.mjs). Lets every destination show a
// Quick-info panel, not just the curated ten.
import raw from '../data/emergency.json'

export const EMERGENCY_SOURCE = raw.source

export function emergencyFor(code) {
  return raw.numbers?.[code] || null
}
