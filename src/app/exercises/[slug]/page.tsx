import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { tierForLp } from "@/lib/ranking";
import { MuscleBadge } from "@/components/MuscleBadge";
import { TierBadge } from "@/components/TierBadge";
import { LogSetForm } from "@/components/LogSetForm";
import { ProgressChart, type ProgressPoint } from "@/components/ProgressChart";
import { DIFFICULTY_LABELS, EQUIPMENT_LABELS, type Difficulty, type Equipment, type MuscleGroup } from "@/lib/constants";

export default async function ExerciseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const exercise = await prisma.exercise.findUnique({ where: { slug } });
  if (!exercise) notFound();

  const [rank, sets] = await Promise.all([
    prisma.exerciseRank.findUnique({
      where: { userId_exerciseId: { userId: user.id, exerciseId: exercise.id } },
    }),
    prisma.workoutSet.findMany({
      where: { userId: user.id, exerciseId: exercise.id },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const secondaryMuscles = JSON.parse(exercise.secondaryMuscles) as MuscleGroup[];
  const isBodyweight = exercise.equipment === "BODYWEIGHT";

  const chartData: ProgressPoint[] = sets.map((s) => ({
    date: s.createdAt.toISOString(),
    estOneRepMax: s.estOneRepMax,
    weightKg: s.weightKg,
    reps: s.reps,
  }));

  const recentSets = [...sets].reverse().slice(0, 15);
  const { tier, isMaxTier } = tierForLp(rank?.lp ?? 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{exercise.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <MuscleBadge muscle={exercise.primaryMuscle as MuscleGroup} />
            {secondaryMuscles.map((m) => (
              <MuscleBadge key={m} muscle={m} subtle />
            ))}
            <span className="text-xs text-zinc-500">{EQUIPMENT_LABELS[exercise.equipment as Equipment]}</span>
            <span className="text-xs text-zinc-600">·</span>
            <span className="text-xs text-zinc-500">{DIFFICULTY_LABELS[exercise.difficulty as Difficulty]}</span>
          </div>
        </div>
        <TierBadge lp={rank?.lp ?? 0} size="lg" />
      </div>

      <p className="mb-6 max-w-2xl text-sm text-zinc-400">{exercise.instructions}</p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Current tier" value={tier.name} />
        <StatCard
          label="Lift Points"
          value={isMaxTier ? `${rank?.lp ?? 0} LP` : `${(rank?.lp ?? 0) % 100}/100`}
        />
        <StatCard
          label={isBodyweight ? "Best reps" : "Best est. 1RM"}
          value={
            rank
              ? isBodyweight
                ? `${Math.round(rank.bestEstOneRepMax)} reps`
                : `${rank.bestEstOneRepMax.toFixed(1)} kg`
              : "—"
          }
        />
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-zinc-300">Progress</h2>
        <ProgressChart data={chartData} unitLabel={isBodyweight ? "reps" : "kg"} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <LogSetForm exerciseId={exercise.id} isBodyweight={isBodyweight} />

        <div>
          <h3 className="mb-2 font-semibold text-white">Recent sets</h3>
          {recentSets.length === 0 ? (
            <p className="text-sm text-zinc-500">No sets logged yet. Log your first one!</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-400">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Date</th>
                    <th className="px-3 py-2 text-right font-medium">Weight</th>
                    <th className="px-3 py-2 text-right font-medium">Reps</th>
                    <th className="px-3 py-2 text-right font-medium">PR</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSets.map((s) => (
                    <tr key={s.id} className="border-t border-zinc-800">
                      <td className="px-3 py-2 text-zinc-400">
                        {s.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-3 py-2 text-right text-zinc-200">{s.weightKg} kg</td>
                      <td className="px-3 py-2 text-right text-zinc-200">{s.reps}</td>
                      <td className="px-3 py-2 text-right">{s.isPr && <span title="Personal record">🏆</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
