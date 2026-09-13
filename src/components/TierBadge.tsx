import { tierForLp } from "@/lib/ranking";

export function TierBadge({ lp, size = "md" }: { lp: number; size?: "sm" | "md" | "lg" }) {
  const { tier, lpIntoTier, isMaxTier } = tierForLp(lp);
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses}`}
      style={{
        color: tier.color,
        backgroundColor: `${tier.color}22`,
        border: `1px solid ${tier.color}55`,
      }}
      title={isMaxTier ? `${tier.name} · ${lp} LP total` : `${tier.name} · ${lpIntoTier}/100 LP`}
    >
      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: tier.color }} />
      {tier.name}
      {!isMaxTier && <span className="opacity-70">{lpIntoTier}/100</span>}
    </span>
  );
}
