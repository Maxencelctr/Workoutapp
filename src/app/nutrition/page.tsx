import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getAcceptedFriendIds } from "@/lib/friends";
import { RecipeCard } from "@/components/RecipeCard";
import { RECIPE_TAGS, type Visibility } from "@/lib/constants";

export default async function NutritionPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const user = await getCurrentUser();
  if (!user) return null;

  const friendIds = await getAcceptedFriendIds(user.id);

  const recipes = await prisma.recipe.findMany({
    where: {
      AND: [
        {
          OR: [
            { authorId: user.id },
            { visibility: "PUBLIC" },
            { visibility: "FRIENDS", authorId: { in: friendIds } },
          ],
        },
        tag ? { tags: { contains: `"${tag}"` } } : {},
      ],
    },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Nutrition</h1>
          <p className="text-sm text-zinc-400">Recipes from you, friends, and the community</p>
        </div>
        <Link
          href="/nutrition/new"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          + Add recipe
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <TagLink label="All" active={!tag} href="/nutrition" />
        {RECIPE_TAGS.map((t) => (
          <TagLink key={t} label={t} active={tag === t} href={`/nutrition?tag=${t}`} />
        ))}
      </div>

      {recipes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          No recipes yet. Be the first to add one!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              authorUsername={r.author.username}
              isMine={r.authorId === user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TagLink({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
          : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
      }`}
    >
      {label}
    </Link>
  );
}
