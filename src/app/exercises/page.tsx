import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ExerciseFilterBar } from "@/components/ExerciseFilterBar";
import { ExerciseCard } from "@/components/ExerciseCard";
import type { Difficulty, Equipment, MuscleGroup } from "@/lib/constants";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ muscle?: string; equipment?: string; q?: string }>;
}) {
  const { muscle, equipment, q } = await searchParams;
  const user = await getCurrentUser();

  const exercises = await prisma.exercise.findMany({
    where: {
      ...(muscle ? { primaryMuscle: muscle } : {}),
      ...(equipment ? { equipment } : {}),
      ...(q ? { name: { contains: q } } : {}),
    },
    orderBy: { name: "asc" },
  });

  const ranks = user
    ? await prisma.exerciseRank.findMany({
        where: { userId: user.id, exerciseId: { in: exercises.map((e) => e.id) } },
      })
    : [];
  const lpByExerciseId = new Map(ranks.map((r) => [r.exerciseId, r.lp]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Exercises</h1>
          <p className="text-sm text-zinc-400">{exercises.length} exercises · browse by muscle group</p>
        </div>
        <Link
          href="/exercises/new"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          + Add exercise
        </Link>
      </div>

      <div className="mb-6">
        <ExerciseFilterBar muscle={muscle} equipment={equipment} q={q} />
      </div>

      {exercises.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          No exercises match those filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              slug={ex.slug}
              name={ex.name}
              primaryMuscle={ex.primaryMuscle as MuscleGroup}
              equipment={ex.equipment as Equipment}
              difficulty={ex.difficulty as Difficulty}
              lp={lpByExerciseId.get(ex.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
