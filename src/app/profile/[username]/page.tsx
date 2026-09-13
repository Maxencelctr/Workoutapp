import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getMuscleGroupBreakdown, getUserOverallStats } from "@/lib/stats";
import { getAcceptedFriendIds } from "@/lib/friends";
import { TierBadge } from "@/components/TierBadge";
import { MuscleGroupBreakdown } from "@/components/MuscleGroupBreakdown";
import { MuscleBadge } from "@/components/MuscleBadge";
import type { MuscleGroup } from "@/lib/constants";

export default async function FriendProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  if (username === user.username) redirect("/profile");

  const target = await prisma.user.findUnique({ where: { username } });
  if (!target) notFound();

  const friendIds = await getAcceptedFriendIds(user.id);
  if (!friendIds.includes(target.id)) notFound();

  const [stats, muscleStats, topRanks] = await Promise.all([
    getUserOverallStats(target.id),
    getMuscleGroupBreakdown(target.id),
    prisma.exerciseRank.findMany({
      where: { userId: target.id },
      orderBy: { lp: "desc" },
      take: 5,
      include: { exercise: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Link href="/friends" className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-300">
        ← Back to friends
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div>
          <h1 className="text-2xl font-bold text-white">{target.username}</h1>
          <p className="text-sm text-zinc-500">Level {stats.level} · {stats.exercisesRanked} exercises ranked</p>
        </div>
        <TierBadge lp={stats.overallLp} size="lg" />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-zinc-300">Muscle group ranks</h2>
        <MuscleGroupBreakdown stats={muscleStats} />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-zinc-300">Top-ranked exercises</h2>
        {topRanks.length === 0 ? (
          <p className="text-sm text-zinc-500">No exercises ranked yet.</p>
        ) : (
          <ul className="space-y-2">
            {topRanks.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-3"
              >
                <div>
                  <p className="font-medium text-white">{r.exercise.name}</p>
                  <MuscleBadge muscle={r.exercise.primaryMuscle as MuscleGroup} subtle />
                </div>
                <TierBadge lp={r.lp} size="sm" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
