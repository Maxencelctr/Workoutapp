import { prisma } from "./prisma";
import { levelForXp, overallLpFromExerciseRanks } from "./ranking";
import { MUSCLE_GROUPS, type MuscleGroup } from "./constants";

export async function getUserOverallStats(userId: string) {
  const [user, ranks] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { xp: true } }),
    prisma.exerciseRank.findMany({ where: { userId }, select: { lp: true } }),
  ]);

  const overallLp = overallLpFromExerciseRanks(ranks.map((r) => r.lp));
  const { level, xpIntoLevel, xpForNextLevel } = levelForXp(user?.xp ?? 0);

  return {
    overallLp,
    exercisesRanked: ranks.length,
    level,
    xpIntoLevel,
    xpForNextLevel,
    xp: user?.xp ?? 0,
  };
}

export interface MuscleGroupStat {
  muscle: MuscleGroup;
  lp: number;
  exercisesRanked: number;
}

/** Per-muscle-group average LP, based on each exercise's *primary* muscle. */
export async function getMuscleGroupBreakdown(userId: string): Promise<MuscleGroupStat[]> {
  const ranks = await prisma.exerciseRank.findMany({
    where: { userId },
    select: { lp: true, exercise: { select: { primaryMuscle: true } } },
  });

  const byMuscle = new Map<string, number[]>();
  for (const r of ranks) {
    const list = byMuscle.get(r.exercise.primaryMuscle) ?? [];
    list.push(r.lp);
    byMuscle.set(r.exercise.primaryMuscle, list);
  }

  return MUSCLE_GROUPS.map((muscle) => {
    const lps = byMuscle.get(muscle) ?? [];
    return {
      muscle,
      lp: lps.length ? Math.round(lps.reduce((a, b) => a + b, 0) / lps.length) : 0,
      exercisesRanked: lps.length,
    };
  });
}
