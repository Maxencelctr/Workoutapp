import Link from "next/link";
import { DIFFICULTY_LABELS, EQUIPMENT_LABELS, type Difficulty, type Equipment, type MuscleGroup } from "@/lib/constants";
import { MuscleBadge } from "./MuscleBadge";
import { TierBadge } from "./TierBadge";

export function ExerciseCard({
  slug,
  name,
  primaryMuscle,
  equipment,
  difficulty,
  lp,
}: {
  slug: string;
  name: string;
  primaryMuscle: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  lp?: number;
}) {
  return (
    <Link
      href={`/exercises/${slug}`}
      className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-emerald-600/50 hover:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{name}</h3>
        {lp !== undefined && <TierBadge lp={lp} size="sm" />}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <MuscleBadge muscle={primaryMuscle} />
        <span className="text-xs text-zinc-500">{EQUIPMENT_LABELS[equipment]}</span>
        <span className="text-xs text-zinc-600">·</span>
        <span className="text-xs text-zinc-500">{DIFFICULTY_LABELS[difficulty]}</span>
      </div>
    </Link>
  );
}
