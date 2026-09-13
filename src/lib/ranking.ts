// RepRank's ranking system, inspired by Liftoff's tier/LP structure
// (Wood -> Bronze -> Silver -> Gold -> Platinum -> Diamond -> Champion ->
// Titan -> Olympian, 100 "Lift Points" per tier, PRs granting a big LP
// boost). Liftoff's exact formula is proprietary and compares lifts
// against its global user base, which this project has no access to, so
// this is a transparent, from-scratch formula tuned for the same *feel*:
// consistent logging inches you forward, personal records launch you up.

export const TIERS = [
  { name: "Wood", color: "#8a6d3b" },
  { name: "Bronze", color: "#b06a3a" },
  { name: "Silver", color: "#9aa3ad" },
  { name: "Gold", color: "#d4af37" },
  { name: "Platinum", color: "#6fc3c9" },
  { name: "Diamond", color: "#6db8ff" },
  { name: "Champion", color: "#a56bff" },
  { name: "Titan", color: "#ff6b6b" },
  { name: "Olympian", color: "#ff3d81" },
] as const;

export type Tier = (typeof TIERS)[number];

export const LP_PER_TIER = 100;
export const MAX_TIER_INDEX = TIERS.length - 1;

export interface TierInfo {
  tier: Tier;
  tierIndex: number;
  lpIntoTier: number;
  lpForNextTier: number | null;
  isMaxTier: boolean;
}

/** Maps an accumulated Lift Points total onto a tier + progress within it. */
export function tierForLp(totalLp: number): TierInfo {
  const safeLp = Math.max(0, Math.round(totalLp));
  const tierIndex = Math.min(Math.floor(safeLp / LP_PER_TIER), MAX_TIER_INDEX);
  const isMaxTier = tierIndex === MAX_TIER_INDEX;
  const lpIntoTier = isMaxTier ? safeLp - MAX_TIER_INDEX * LP_PER_TIER : safeLp % LP_PER_TIER;
  return {
    tier: TIERS[tierIndex],
    tierIndex,
    lpIntoTier,
    lpForNextTier: isMaxTier ? null : LP_PER_TIER,
    isMaxTier,
  };
}

/**
 * Epley formula: a standard estimate of a one-rep max from any weight/rep
 * pair. For unweighted bodyweight movements (weightKg === 0, e.g. plain
 * pull-ups) there's no load to extrapolate from, so the rep count itself
 * becomes the tracked score — more reps is strictly more impressive.
 */
export function estimateOneRepMax(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg < 0) return 0;
  if (weightKg === 0) return reps;
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export interface SetLpResult {
  lpGained: number;
  isPr: boolean;
}

/**
 * LP awarded for one logged set.
 * - The very first time an exercise is logged, a flat baseline is granted.
 * - Beating your previous best estimated 1RM (a PR) grants a large bonus
 *   scaled by the percentage improvement.
 * - A non-PR set still grants a small "showed up" reward, but only once
 *   per exercise per day, to keep LP tied to genuine progress rather than
 *   logging the same set over and over.
 */
export function computeSetLp(params: {
  newEstOneRepMax: number;
  previousBestEstOneRepMax: number;
  isFirstSetEverForExercise: boolean;
  isFirstSetTodayForExercise: boolean;
}): SetLpResult {
  const { newEstOneRepMax, previousBestEstOneRepMax, isFirstSetEverForExercise, isFirstSetTodayForExercise } = params;

  if (isFirstSetEverForExercise) {
    return { lpGained: 15, isPr: true };
  }

  if (newEstOneRepMax > previousBestEstOneRepMax) {
    const pctIncrease = (newEstOneRepMax - previousBestEstOneRepMax) / previousBestEstOneRepMax;
    const lpGained = Math.min(100, Math.max(10, Math.round(pctIncrease * 400)));
    return { lpGained, isPr: true };
  }

  return { lpGained: isFirstSetTodayForExercise ? 2 : 0, isPr: false };
}

/** Profile-level XP curve: a flat 100 XP per level, uncapped. */
export function levelForXp(xp: number) {
  const safeXp = Math.max(0, Math.round(xp));
  const level = Math.floor(safeXp / 100) + 1;
  const xpIntoLevel = safeXp % 100;
  return { level, xpIntoLevel, xpForNextLevel: 100 };
}

export const XP_PER_SET = 5;
export const XP_PER_PR = 15;
export const XP_PER_SESSION = 10;

/** Overall account rank: the simple average of a user's per-exercise LP totals. */
export function overallLpFromExerciseRanks(exerciseLpTotals: number[]): number {
  if (exerciseLpTotals.length === 0) return 0;
  const sum = exerciseLpTotals.reduce((acc, lp) => acc + lp, 0);
  return Math.round(sum / exerciseLpTotals.length);
}
