import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { previewBuckets, previewSnapshot } from "@/services/previewData";
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

      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card className="flex items-center gap-4 bg-primary-container">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
            <Symbol name="savings" filled className="text-on-primary-container" size={24} />
          </div>
          <div>
            <p className="text-[12px] uppercase tracking-wider text-on-primary-container/80">
              Total recoverable
            </p>
            <p className="text-[28px] font-normal tabular-nums text-on-primary-container">
              {formatBytes(totalRecoverable)}
            </p>
            <p className="mt-1 text-[12px] text-on-primary-container/80">
              from {previewSnapshot.usedBytes ? formatBytes(previewSnapshot.usedBytes) : "your storage"}{" "}
              in use
            </p>
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
                    {b.fileCount.toLocaleString()} files • {formatBytes(b.totalBytes)}
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

        <div className="sticky bottom-4 mt-2">
          <MButton
            size="lg"
            full
            leading={<Symbol name="compress" size={20} />}
            onClick={() => navigate({ to: "/compress" })}
          >
            Review and compress
          </MButton>
        </div>
      </div>
    </div>
  );
}
