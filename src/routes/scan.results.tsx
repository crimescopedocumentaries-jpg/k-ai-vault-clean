import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { previewBuckets } from "@/services/previewData";
import { formatBytes } from "@/lib/format";

export const Route = createFileRoute("/scan/results")({
  component: ScanResults,
  validateSearch: (s: Record<string, unknown>) => ({
    kind: (s.kind as string) ?? undefined,
  }),
});

function ScanResults() {
  const navigate = useNavigate();
  const totalRecoverable = previewBuckets.reduce((a, b) => a + b.recoverableBytes, 0);
  const photoBuckets = previewBuckets.filter((b) => !b.id.includes("video"));
  const videoBuckets = previewBuckets.filter((b) => b.id.includes("video"));
  const photoCount = photoBuckets.reduce((a, b) => a + b.fileCount, 0);
  const videoCount = videoBuckets.reduce((a, b) => a + b.fileCount, 0);

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
        {/* Summary */}
        <Card className="bg-primary-container">
          <p className="text-[12px] font-medium uppercase tracking-wider text-on-primary-container/80">
            Recoverable space
          </p>
          <p className="mt-1 text-[36px] font-normal leading-none tabular-nums text-on-primary-container">
            {formatBytes(totalRecoverable)}
          </p>
          <p className="mt-1 text-[13px] text-on-primary-container/80">
            Originals stay protected in Safe Vault for 30 days.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <SummaryChip icon="image" label="Photos found" value={photoCount.toLocaleString()} />
            <SummaryChip icon="movie" label="Videos found" value={videoCount.toLocaleString()} />
            <SummaryChip icon="schedule" label="Estimated time" value="8 min" />
            <SummaryChip icon="tune" label="Recommendation" value="Balanced" />
          </div>
        </Card>

        <h2 className="px-1 text-[15px] font-medium text-on-surface">By category</h2>
        <div className="flex flex-col gap-2">
          {previewBuckets.map((b) => (
            <Link key={b.id} to="/review" search={{ bucket: b.id }} className="ripple">
              <Card padded={false} className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-2">
                  <Symbol name={b.icon} className="text-primary" size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-on-surface">{b.label}</p>
                  <p className="text-[12px] text-on-surface-variant">
                    {b.fileCount.toLocaleString()} files · {formatBytes(b.totalBytes)}
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

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-10 -mt-2 flex flex-col gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <MButton
          size="lg"
          full
          leading={<Symbol name="compress" size={20} />}
          onClick={() => navigate({ to: "/compress" })}
        >
          Recover {formatBytes(totalRecoverable)}
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
