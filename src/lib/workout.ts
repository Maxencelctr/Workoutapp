// Not gated by "server-only": this module is also imported by prisma/seed.ts,
// a plain Node script outside Next's bundler where that guard would just throw.
import { prisma } from "./prisma";
import { computeSetLp, estimateOneRepMax, XP_PER_PR, XP_PER_SET } from "./ranking";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export interface LogSetResult {
  setId: string;
  estOneRepMax: number;
  lpGained: number;
  isPr: boolean;
  newBestEstOneRepMax: number;
}

/**
 * Records one logged set: creates/reuses today's workout session, updates
 * the user's per-exercise rank (LP + best e1RM), and awards profile XP.
 * All in a single transaction so rank/XP never drift from the set log.
 */
export async function logSetForUser(params: {
  userId: string;
  exerciseId: string;
  weightKg: number;
  reps: number;
  sessionId?: string;
  at?: Date;
}): Promise<LogSetResult> {
  const at = params.at ?? new Date();
  const estOneRepMax = estimateOneRepMax(params.weightKg, params.reps);

  return prisma.$transaction(async (tx) => {
    let sessionId = params.sessionId;
    if (!sessionId) {
      const todaysSession = await tx.workoutSession.findFirst({
        where: { userId: params.userId, date: { gte: startOfDay(at), lte: endOfDay(at) } },
        orderBy: { date: "desc" },
      });
      sessionId = todaysSession
        ? todaysSession.id
        : (await tx.workoutSession.create({ data: { userId: params.userId, date: at } })).id;
    }

    const existingRank = await tx.exerciseRank.findUnique({
      where: { userId_exerciseId: { userId: params.userId, exerciseId: params.exerciseId } },
    });

    const isFirstSetEverForExercise = !existingRank;

    const todaysEarlierSet = await tx.workoutSet.findFirst({
      where: {
        userId: params.userId,
        exerciseId: params.exerciseId,
        createdAt: { gte: startOfDay(at), lte: endOfDay(at) },
      },
    });
    const isFirstSetTodayForExercise = !todaysEarlierSet;

    const { lpGained, isPr } = computeSetLp({
      newEstOneRepMax: estOneRepMax,
      previousBestEstOneRepMax: existingRank?.bestEstOneRepMax ?? 0,
      isFirstSetEverForExercise,
      isFirstSetTodayForExercise,
    });

    const newBestEstOneRepMax = Math.max(existingRank?.bestEstOneRepMax ?? 0, estOneRepMax);

    await tx.exerciseRank.upsert({
      where: { userId_exerciseId: { userId: params.userId, exerciseId: params.exerciseId } },
      create: {
        userId: params.userId,
        exerciseId: params.exerciseId,
        lp: lpGained,
        bestEstOneRepMax: newBestEstOneRepMax,
        lastSetAt: at,
      },
      update: {
        lp: { increment: lpGained },
        bestEstOneRepMax: newBestEstOneRepMax,
        lastSetAt: at,
      },
    });

    const set = await tx.workoutSet.create({
      data: {
        sessionId,
        userId: params.userId,
        exerciseId: params.exerciseId,
        weightKg: params.weightKg,
        reps: params.reps,
        estOneRepMax,
        lpGained,
        isPr,
        createdAt: at,
      },
    });

    await tx.user.update({
      where: { id: params.userId },
      data: { xp: { increment: XP_PER_SET + (isPr ? XP_PER_PR : 0) } },
    });

    return {
      setId: set.id,
      estOneRepMax,
      lpGained,
      isPr,
      newBestEstOneRepMax,
    };
  });
}
