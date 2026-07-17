import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { formatBytes } from "@/lib/format";
import { StorageService, AIService } from "@/modules";
import type { StorageReport } from "@/modules/storage/service";

export const Route = createFileRoute("/scan/results")({
  component: ScanResults,
  validateSearch: (s: Record<string, unknown>) => ({
    kind: (s.kind as string) ?? undefined,
  }),
});

type BucketRow = {
  id: keyof StorageReport["breakdown"];
  label: string;
  icon: string;
  totalBytes: number;
  recoverableBytes: number;
};

const CATEGORY_META: Record<
  keyof StorageReport["breakdown"],
  { label: string; icon: string; recoverableRatio: number }
> = {
  videos: { label: "Videos", icon: "movie", recoverableRatio: 0.42 },
  photos: { label: "Photos", icon: "photo_camera", recoverableRatio: 0.22 },
  apps: { label: "Apps & caches", icon: "apps", recoverableRatio: 0.15 },
  audio: { label: "Audio", icon: "music_note", recoverableRatio: 0.08 },
  documents: { label: "Documents", icon: "description", recoverableRatio: 0.06 },
  other: { label: "Other", icon: "folder", recoverableRatio: 0.05 },
};

function buildBuckets(report: StorageReport): BucketRow[] {
  const rows = (Object.keys(report.breakdown) as (keyof StorageReport["breakdown"])[])
    .map((id) => {
      const bytes = report.breakdown[id];
      const meta = CATEGORY_META[id];
      return {
        id,
        label: meta.label,
        icon: meta.icon,
        totalBytes: bytes,
        recoverableBytes: Math.floor(bytes * meta.recoverableRatio),
      };
    })
    .filter((r) => r.totalBytes > 0)
    .sort((a, b) => b.recoverableBytes - a.recoverableBytes);
  return rows;
}

function ScanResults() {
  const navigate = useNavigate();
  const [report, setReport] = useState<StorageReport | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await StorageService.scan();
      if (cancelled) return;
      setReport(r);
      setLoading(false);
      try {
        const ai = await AIService.ask({
          kind: "recommendation",
          prompt: "Recommend the highest-impact category to recover storage from.",
          context: { breakdown: r.breakdown, recoverableBytes: r.recoverableBytes },
        });
        if (!cancelled) setRecommendation(ai.text);
      } catch {
        /* AIService already falls back to local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const buckets = report ? buildBuckets(report) : [];
  const totalRecoverable = buckets.reduce((a, b) => a + b.recoverableBytes, 0);
  const insight = report?.insight ?? recommendation;

  return (
    <div className="flex flex-1 flex-col">
      <AppBar
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/home" })}>
            <Symbol name="arrow_back" />
          </IconButton>
        }
        title="Scan results"
      />

      <div className="flex flex-col gap-4 px-4 pb-24">
        <Card className="bg-primary-container">
          <p className="text-[12px] font-medium uppercase tracking-wider text-on-primary-container/80">
            Recoverable space
          </p>
          <p className="mt-1 text-[36px] font-normal leading-none tabular-nums text-on-primary-container">
            {loading ? "—" : formatBytes(totalRecoverable)}
          </p>
          <p className="mt-1 text-[13px] text-on-primary-container/80">
            {insight ?? "Originals stay protected in Safe Vault for 30 days."}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <SummaryChip
              icon="sd_storage"
              label="Used"
              value={report ? formatBytes(report.usedBytes) : "—"}
            />
            <SummaryChip
              icon="check_circle"
              label="Free"
              value={report ? formatBytes(report.freeBytes) : "—"}
            />
            <SummaryChip
              icon="favorite"
              label="Health score"
              value={report ? `${report.healthScore}%` : "—"}
            />
            <SummaryChip
              icon="tune"
              label="Recommendation"
              value={buckets[0]?.label ?? "Balanced"}
            />
          </div>
        </Card>

        <h2 className="px-1 text-[15px] font-medium text-on-surface">By category</h2>
        <div className="flex flex-col gap-2">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} padded={false} className="p-4">
                <div className="h-11 animate-pulse rounded-2xl bg-surface-2" />
              </Card>
            ))}
          {!loading && buckets.length === 0 && (
            <Card className="text-center text-[13px] text-on-surface-variant">
              Nothing to recover right now.
            </Card>
          )}
          {buckets.map((b) => (
            <Link key={b.id} to="/review" search={{ bucket: b.id }} className="ripple">
              <Card padded={false} className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-2">
                  <Symbol name={b.icon} className="text-primary" size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-on-surface">{b.label}</p>
                  <p className="text-[12px] text-on-surface-variant">
                    {formatBytes(b.totalBytes)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium tabular-nums text-primary">
                    {formatBytes(b.recoverableBytes)}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">recoverable</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mt-2 flex flex-col gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <MButton
          size="lg"
          full
          disabled={loading || totalRecoverable === 0}
          leading={<Symbol name="compress" size={20} />}
          onClick={() => navigate({ to: "/compress" })}
        >
          Recover {loading ? "—" : formatBytes(totalRecoverable)}
        </MButton>
        <MButton variant="text" full onClick={() => navigate({ to: "/review", search: {} })}>
          Review files first
        </MButton>
      </div>
    </div>
  );
}

function SummaryChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-primary/15 p-3">
      <div className="flex items-center gap-1.5">
        <Symbol name={icon} className="text-on-primary-container" size={16} />
        <span className="text-[11px] uppercase tracking-wider text-on-primary-container/80">
          {label}
        </span>
      </div>
      <p className="mt-1 text-[15px] font-medium tabular-nums text-on-primary-container">
        {value}
      </p>
    </div>
  );
}
