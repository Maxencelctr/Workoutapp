import { MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { tierForLp } from "@/lib/ranking";
import type { MuscleGroupStat } from "@/lib/stats";

export function MuscleGroupBreakdown({ stats }: { stats: MuscleGroupStat[] }) {
  return (
    <div className="space-y-2">
      {stats.map((s) => {
        const { tier, lpIntoTier, isMaxTier } = tierForLp(s.lp);
        const pct = isMaxTier ? 100 : lpIntoTier;
        return (
          <div key={s.muscle} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-zinc-400">{MUSCLE_GROUP_LABELS[s.muscle]}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${s.exercisesRanked ? pct : 0}%`, backgroundColor: tier.color }}
              />
            </div>
            <span className="w-16 shrink-0 text-right text-xs font-medium" style={{ color: s.exercisesRanked ? tier.color : "#52525b" }}>
              {s.exercisesRanked ? tier.name : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
