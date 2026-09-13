import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getUserOverallStats } from "@/lib/stats";
import { AddFriendForm } from "@/components/AddFriendForm";
import { TierBadge } from "@/components/TierBadge";
import { acceptFriendRequestAction, declineFriendRequestAction } from "@/actions/friends";

export default async function FriendsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const friendships = await prisma.friendship.findMany({
    where: { OR: [{ requesterId: user.id }, { addresseeId: user.id }] },
    include: {
      requester: { select: { id: true, username: true } },
      addressee: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const incoming = friendships.filter((f) => f.status === "PENDING" && f.addresseeId === user.id);
  const outgoing = friendships.filter((f) => f.status === "PENDING" && f.requesterId === user.id);
  const accepted = friendships.filter((f) => f.status === "ACCEPTED");

  const friendStats = await Promise.all(
    accepted.map(async (f) => {
      const friend = f.requesterId === user.id ? f.addressee : f.requester;
      const stats = await getUserOverallStats(friend.id);
      return { friend, stats };
    }),
  );
  friendStats.sort((a, b) => b.stats.overallLp - a.stats.overallLp);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-white">Friends</h1>
      <p className="mb-6 text-sm text-zinc-400">Add friends and compare progress.</p>

      <div className="mb-8">
        <AddFriendForm />
      </div>

      {incoming.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 text-sm font-semibold text-zinc-300">Friend requests</h2>
          <ul className="space-y-2">
            {incoming.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-3"
              >
                <span className="font-medium text-white">{f.requester.username}</span>
                <div className="flex gap-2">
                  <form action={acceptFriendRequestAction}>
                    <input type="hidden" name="friendshipId" value={f.id} />
                    <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400">
                      Accept
                    </button>
                  </form>
                  <form action={declineFriendRequestAction}>
                    <input type="hidden" name="friendshipId" value={f.id} />
                    <button className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-red-500 hover:text-red-400">
                      Decline
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {outgoing.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 text-sm font-semibold text-zinc-300">Pending</h2>
          <ul className="space-y-2">
            {outgoing.map((f) => (
              <li key={f.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-sm text-zinc-400">
                Waiting on <span className="text-zinc-200">{f.addressee.username}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold text-zinc-300">
          Your friends {accepted.length > 0 && `(${accepted.length})`}
        </h2>
        {friendStats.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
            No friends yet. Search a username above to send a request.
          </p>
        ) : (
          <ul className="space-y-2">
            {friendStats.map(({ friend, stats }) => (
              <li key={friend.id}>
                <Link
                  href={`/profile/${friend.username}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 transition hover:border-emerald-600/50"
                >
                  <div>
                    <p className="font-medium text-white">{friend.username}</p>
                    <p className="text-xs text-zinc-500">Level {stats.level} · {stats.exercisesRanked} exercises ranked</p>
                  </div>
                  <TierBadge lp={stats.overallLp} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
