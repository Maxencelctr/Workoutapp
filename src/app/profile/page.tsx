import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getMuscleGroupBreakdown, getUserOverallStats } from "@/lib/stats";
import { TierBadge } from "@/components/TierBadge";
import { BodyWeightForm } from "@/components/BodyWeightForm";
import { MuscleGroupBreakdown } from "@/components/MuscleGroupBreakdown";
import { RecipeCard } from "@/components/RecipeCard";
import type { Visibility } from "@/lib/constants";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [stats, muscleStats, recipes, friendCount] = await Promise.all([
    getUserOverallStats(user.id),
    getMuscleGroupBreakdown(user.id),
    prisma.recipe.findMany({ where: { authorId: user.id }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.friendship.count({
      where: { status: "ACCEPTED", OR: [{ requesterId: user.id }, { addresseeId: user.id }] },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
          <TierBadge lp={stats.overallLp} size="lg" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-semibold text-white">{stats.level}</p>
            <p className="text-xs text-zinc-500">Level</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{stats.exercisesRanked}</p>
            <p className="text-xs text-zinc-500">Exercises ranked</p>
          </div>
          <div>
            <Link href="/friends" className="text-lg font-semibold text-white hover:text-emerald-400">
              {friendCount}
            </Link>
            <p className="text-xs text-zinc-500">Friends</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-zinc-800 pt-4">
          <span className="text-sm text-zinc-400">Body weight</span>
          <BodyWeightForm current={user.bodyWeightKg} />
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-zinc-300">Muscle group ranks</h2>
        <p className="mb-3 text-xs text-zinc-500">
          Based on the average Lift Points across exercises you&apos;ve logged for each primary muscle.
        </p>
        <MuscleGroupBreakdown stats={muscleStats} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-300">Your recipes</h2>
          <Link href="/nutrition/new" className="text-sm font-medium text-emerald-400 hover:underline">
            + Add recipe
          </Link>
        </div>
        {recipes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">
            You haven&apos;t added any recipes yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recipes.map((r) => (
              <RecipeCard
                key={r.id}
                id={r.id}
                title={r.title}
                description={r.description}
                calories={r.calories}
                proteinG={r.proteinG}
                tags={JSON.parse(r.tags)}
                visibility={r.visibility as Visibility}
                authorUsername={user.username}
                isMine
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
