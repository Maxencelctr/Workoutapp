import { EQUIPMENT, EQUIPMENT_LABELS, MUSCLE_GROUPS, MUSCLE_GROUP_LABELS } from "@/lib/constants";

export function ExerciseFilterBar({
  muscle,
  equipment,
  q,
}: {
  muscle?: string;
  equipment?: string;
  q?: string;
}) {
  return (
    <form method="get" className="flex flex-wrap gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search exercises..."
        className="min-w-40 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
      />
      <select
        name="muscle"
        defaultValue={muscle ?? ""}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
      >
        <option value="">All muscles</option>
        {MUSCLE_GROUPS.map((m) => (
          <option key={m} value={m}>
            {MUSCLE_GROUP_LABELS[m]}
          </option>
        ))}
      </select>
      <select
        name="equipment"
        defaultValue={equipment ?? ""}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
      >
        <option value="">All equipment</option>
        {EQUIPMENT.map((eq) => (
          <option key={eq} value={eq}>
            {EQUIPMENT_LABELS[eq]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
      >
        Filter
      </button>
    </form>
  );
}
