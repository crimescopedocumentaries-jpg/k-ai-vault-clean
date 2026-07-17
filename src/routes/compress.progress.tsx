import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { formatBytes, formatDuration } from "@/lib/format";
import { CompressionService } from "@/modules";
import type { CompressionMode } from "@/modules/compression/service";

export const Route = createFileRoute("/compress/progress")({
  component: CompressProgress,
  validateSearch: (s: Record<string, unknown>) => ({
    quality: (s.quality as string) ?? "balanced",
  }),
});

const UI_TO_MODE: Record<string, CompressionMode> = {
  high: "high-quality",
  balanced: "balanced",
  maximum: "max-savings",
};

const TOTAL_FILES = 128;
const PATHS = Array.from({ length: TOTAL_FILES }, (_, i) => `nominal://file-${i}`);

const files = [
  "VID_20240102_113322.mp4",
  "VID_20240118_204410.mp4",
  "VID_20240301_090012.mp4",
  "VID_20240412_182233.mp4",
  "VID_20240508_121540.mp4",
];

function CompressProgress() {
  const navigate = useNavigate();
  const { quality } = Route.useSearch();
  const mode = UI_TO_MODE[quality] ?? "balanced";

  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [estimatedSavings, setEstimatedSavings] = useState(0);
  const [estimatedDurationMs, setEstimatedDurationMs] = useState(0);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const est = await CompressionService.estimate(PATHS, mode);
      if (cancelled) return;
      setEstimatedSavings(est.savingsBytes);
      setEstimatedDurationMs(est.durationMs);
      startedAt.current = Date.now();
      await CompressionService.compress(PATHS, mode, (p) => {
        if (cancelled) return;
        const pct = Math.min(100, p * 100);
        setProgress(pct);
        setProcessed(Math.min(TOTAL_FILES, Math.round(p * TOTAL_FILES)));
      });
      if (cancelled) return;
      setProgress(100);
      setProcessed(TOTAL_FILES);
      setTimeout(() => navigate({ to: "/complete" }), 500);
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, navigate]);

  const bytesSaved = (progress / 100) * estimatedSavings;
  const remainingMs = Math.max(0, estimatedDurationMs * (1 - progress / 100));
  const eta = Math.max(1, Math.round(remainingMs / 1000));

  const size = 220;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;

  return (
    <div className="flex flex-1 flex-col">
      <AppBar
        title="Compressing"
        leading={
          <IconButton label="Minimise" onClick={() => navigate({ to: "/jobs" })}>
            <Symbol name="expand_more" />
          </IconButton>
        }
      />

      <div className="flex flex-col items-center gap-6 px-6 pt-4">
        <div className="relative" style={{ width: size, height: size }}>
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
              style={{ transition: "stroke-dashoffset 220ms linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[12px] uppercase tracking-wider text-on-surface-variant">
              Recovered
            </span>
            <span className="mt-1 text-4xl font-normal tabular-nums text-on-surface">
              {formatBytes(bytesSaved)}
            </span>
            <span className="mt-1 text-[12px] text-on-surface-variant">
              {processed} of {TOTAL_FILES} files
            </span>
          </div>
        </div>

        <Card padded={false} className="w-full p-4">
          <div className="flex items-center gap-3">
            <Symbol name="autorenew" className="animate-spin text-primary" size={22} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-on-surface">
                {files[processed % files.length]}
              </p>
              <p className="text-[12px] text-on-surface-variant">
                About {formatDuration(eta)} remaining
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>

        <Card className="flex w-full gap-3 bg-tertiary-container">
          <Symbol name="shield" filled className="mt-0.5 text-on-tertiary-container" size={20} />
          <p className="text-[12px] leading-relaxed text-on-tertiary-container">
            Originals are being copied to Safe Vault before compression. You can restore any file
            in the next 30 days.
          </p>
        </Card>

        <MButton variant="outlined" full onClick={() => navigate({ to: "/jobs" })}>
          Run in background
        </MButton>
      </div>
    </div>
  );
}
