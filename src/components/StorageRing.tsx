type Props = {
  score: number; // 0-100
  size?: number;
  usedBytesLabel?: string;
  totalBytesLabel?: string;
};

/** Animated storage health ring — SVG so it renders instantly at 60fps. */
export function StorageRing({
  score,
  size = 220,
  usedBytesLabel,
  totalBytesLabel,
}: Props) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-ring-track)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-ring-fill)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 900ms cubic-bezier(0.2, 0.7, 0.2, 1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[13px] font-medium uppercase tracking-wider text-on-surface-variant">
          Storage
        </span>
        <span className="mt-1 text-5xl font-normal tabular-nums text-on-surface">
          {Math.round(pct)}
        </span>
        <span className="text-[13px] text-on-surface-variant">/ 100</span>
        {usedBytesLabel && (
          <span className="mt-2 text-[12px] text-on-surface-variant">
            {usedBytesLabel}
            {totalBytesLabel ? ` of ${totalBytesLabel}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
