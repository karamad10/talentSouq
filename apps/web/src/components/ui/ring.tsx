import { cn } from "@/lib/cn";

export function Ring({
  value,
  size = 48,
  strokeWidth = 5,
  label,
  srLabel,
  className
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  srLabel?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;
  return (
    <span
      role="img"
      aria-label={srLabel ?? `${label ?? "Progress"}: ${clamped}%`}
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-ts-surface-2" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-ts-primary"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-ts-ink">{clamped}%</span>
    </span>
  );
}
