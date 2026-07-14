/**
 * Single source of truth for marketing trust numbers shown on public pages.
 * Used while the platform is early-stage so hero/CTA/about never contradict
 * each other or show a dead-looking "0".
 * Swap to live DB counts once volume is strong enough.
 */
export const TRUST_STATS = {
  coachings: { value: "120+", label: "Coachings listed", numeric: 120 },
  bookings: { value: "2.5k+", label: "Demo bookings", numeric: 2500 },
  cities: { value: "25+", label: "Cities covered", numeric: 25 },
  students: { value: "8k+", label: "Students guided", numeric: 8000 },
};

export const TRUST_STATS_LIST = [
  TRUST_STATS.coachings,
  TRUST_STATS.bookings,
  TRUST_STATS.cities,
];

export const TRUST_ACTIVITY_LINE = "New demo slots added this week";

/**
 * Prefer live DB count when it's above a floor; otherwise fall back to the
 * marketing placeholder so the UI never looks empty/broken.
 */
export function resolveStatDisplay(liveCount, placeholder) {
  const live = Number(liveCount) || 0;
  if (live >= placeholder.numeric * 0.5) {
    if (live >= 1000) return `${Math.floor(live / 1000)}k+`;
    return `${live}+`;
  }
  return placeholder.value;
}
