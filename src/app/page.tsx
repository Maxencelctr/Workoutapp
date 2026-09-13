import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getUserOverallStats } from "@/lib/stats";
import { TierBadge } from "@/components/TierBadge";
import { MuscleBadge } from "@/components/MuscleBadge";
import type { MuscleGroup } from "@/lib/constants";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [stats, recentPrs, topRanks, recentSessions] = await Promise.all([
    getUserOverallStats(user.id),
    prisma.workoutSet.findMany({
      where: { userId: user.id, isPr: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { exercise: true },
    }),
    prisma.exerciseRank.findMany({
      where: { userId: user.id },
      orderBy: { lp: "desc" },
      take: 5,
      include: { exercise: true },
    }),
    prisma.workoutSession.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 5,
      include: { _count: { select: { sets: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5">
        <div>
          <p className="text-sm text-zinc-400">Welcome back,</p>
          <h1 className="text-2xl font-bold text-white">{user.username}</h1>
          <div className="mt-2 flex items-center gap-3">
            <TierBadge lp={stats.overallLp} size="lg" />
            <span className="text-sm text-zinc-400">Level {stats.level}</span>
          </div>
          <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${stats.xpIntoLevel}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {stats.xpIntoLevel}/{stats.xpForNextLevel} XP to level {stats.level + 1}
          </p>
        </div>
        <Link
          href="/exercises"
          className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-black transition hover:bg-emerald-400"
        >
          Log a workout
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <section>
          <h2 className="mb-2 text-sm font-semibold text-zinc-300">Top-ranked exercises</h2>
          {topRanks.length === 0 ? (
            <EmptyState href="/exercises" label="Browse exercises" text="Log your first set to start ranking up." />
          ) : (
            <ul className="space-y-2">
              {topRanks.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/exercises/${r.exercise.slug}`}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 transition hover:border-emerald-600/50"
                  >
                    <div>
                      <p className="font-medium text-white">{r.exercise.name}</p>
                      <MuscleBadge muscle={r.exercise.primaryMuscle as MuscleGroup} subtle />
                    </div>
                    <TierBadge lp={r.lp} size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-zinc-300">Recent PRs</h2>
          {recentPrs.length === 0 ? (
            <EmptyState href="/exercises" label="Browse exercises" text="No personal records yet." />
          ) : (
            <ul className="space-y-2">
              {recentPrs.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-3"
                >
                  <div>
                    <p className="font-medium text-white">🏆 {s.exercise.name}</p>
                    <p className="text-xs text-zinc-500">
                      {s.weightKg > 0 ? `${s.weightKg} kg × ${s.reps}` : `${s.reps} reps`}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {s.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-zinc-300">Recent sessions</h2>
        {recentSessions.length === 0 ? (
          <EmptyState href="/exercises" label="Browse exercises" text="No sessions logged yet." />
        ) : (
          <ul className="space-y-2">
            {recentSessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-sm"
              >
                <span className="text-zinc-300">
                  {s.date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                </span>
                <span className="text-zinc-500">{s._count.sets} sets</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EmptyState({ href, label, text }: { href: string; label: string; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center">
      <p className="mb-2 text-sm text-zinc-500">{text}</p>
      <Link href={href} className="text-sm font-medium text-emerald-400 hover:underline">
        {label} →
      </Link>
    </div>
  );
}
