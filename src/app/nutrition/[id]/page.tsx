import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getAcceptedFriendIds } from "@/lib/friends";
import { VISIBILITY_LABELS, type Visibility } from "@/lib/constants";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: { author: { select: { username: true, id: true } } },
  });
  if (!recipe) notFound();

  const isMine = recipe.authorId === user.id;
  if (!isMine && recipe.visibility === "PRIVATE") notFound();
  if (!isMine && recipe.visibility === "FRIENDS") {
    const friendIds = await getAcceptedFriendIds(user.id);
    if (!friendIds.includes(recipe.authorId)) notFound();
  }

  const ingredients = JSON.parse(recipe.ingredients) as { name: string; quantity: string }[];
  const tags = JSON.parse(recipe.tags) as string[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">{recipe.title}</h1>
        <p className="mt-1 text-sm text-zinc-400">{recipe.description}</p>
        <p className="mt-2 text-xs text-zinc-600">
          By {isMine ? "you" : recipe.author.username} · {VISIBILITY_LABELS[recipe.visibility as Visibility]} ·{" "}
          {recipe.prepMinutes} min · {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-3">
        <MacroStat label="Calories" value={recipe.calories} />
        <MacroStat label="Protein" value={`${recipe.proteinG}g`} />
        <MacroStat label="Carbs" value={`${recipe.carbsG}g`} />
        <MacroStat label="Fat" value={`${recipe.fatG}g`} />
      </div>

      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mb-6">
        <h2 className="mb-2 font-semibold text-white">Ingredients</h2>
        <ul className="space-y-1 text-sm text-zinc-300">
          {ingredients.map((ing, i) => (
            <li key={i} className="flex justify-between border-b border-zinc-900 py-1.5">
              <span>{ing.name}</span>
              <span className="text-zinc-500">{ing.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-2 font-semibold text-white">Instructions</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">{recipe.instructions}</p>
      </div>
    </div>
  );
}

function MacroStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}
