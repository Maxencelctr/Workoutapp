import { MUSCLE_GROUP_LABELS, type MuscleGroup } from "@/lib/constants";

const COLORS: Record<MuscleGroup, string> = {
  CHEST: "#f87171",
  BACK: "#60a5fa",
  SHOULDERS: "#fbbf24",
  BICEPS: "#34d399",
  TRICEPS: "#a78bfa",
  FOREARMS: "#38bdf8",
  CORE: "#fb923c",
  QUADRICEPS: "#4ade80",
  HAMSTRINGS: "#2dd4bf",
  GLUTES: "#f472b6",
  CALVES: "#818cf8",
  TRAPS: "#facc15",
};

export function MuscleBadge({ muscle, subtle = false }: { muscle: MuscleGroup; subtle?: boolean }) {
  const color = COLORS[muscle];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
      style={{
        color: subtle ? "#a1a1aa" : color,
        backgroundColor: subtle ? "#27272a" : `${color}1a`,
      }}
    >
      {MUSCLE_GROUP_LABELS[muscle]}
    </span>
  );
}

export { COLORS as MUSCLE_COLORS };
