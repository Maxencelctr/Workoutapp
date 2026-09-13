import Link from "next/link";
import { VISIBILITY_LABELS, type Visibility } from "@/lib/constants";

export function RecipeCard({
  id,
  title,
  description,
  calories,
  proteinG,
  tags,
  visibility,
  authorUsername,
  isMine,
}: {
  id: string;
  title: string;
  description: string;
  calories: number;
  proteinG: number;
  tags: string[];
  visibility: Visibility;
  authorUsername: string;
  isMine: boolean;
}) {
  return (
    <Link
      href={`/nutrition/${id}`}
      className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-emerald-600/50 hover:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="shrink-0 text-xs text-zinc-500">{calories} kcal</span>
      </div>
      <p className="line-clamp-2 text-sm text-zinc-400">{description}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
          {proteinG}g protein
        </span>
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-xs text-zinc-600">
        {isMine ? "You" : authorUsername} · {VISIBILITY_LABELS[visibility]}
      </p>
    </Link>
  );
}
