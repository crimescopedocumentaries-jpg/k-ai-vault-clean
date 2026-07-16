import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { StorageRing } from "@/components/StorageRing";
import { previewSnapshot, previewBuckets, previewVault, previewJobs } from "@/services/previewData";
import { formatBytes, formatDuration } from "@/lib/format";

export const Route = createFileRoute("/_app/home")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const snap = previewSnapshot;
  const insights = previewBuckets.slice(0, 4);
  const recent = previewJobs.filter((j) => j.status === "completed").slice(0, 3);

  return (
    <div className="flex flex-1 flex-col">
      <AppBar
        title="K-Ai"
        leading={
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container">
            <Symbol name="hard_drive_2" filled className="text-on-primary-container" size={20} />
          </div>
        }
        trailing={
          <>
            <IconButton label="Notifications">
              <Symbol name="notifications" />
            </IconButton>
          </>
        }
      />

      <div className="flex flex-col gap-4 px-4 pb-6">
        {/* Storage Health */}
        <Card className="flex flex-col items-center gap-3 py-6">
          <div className="flex items-center gap-2 self-start">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary-container">
              <Symbol name="ecg_heart" filled className="text-on-tertiary-container" size={16} />
            </span>
            <p className="text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
              Storage Health
            </p>
          </div>
          <StorageRing
            score={snap.healthScore}
            usedBytesLabel={formatBytes(snap.usedBytes)}
            totalBytesLabel={formatBytes(snap.totalBytes)}
          />
          <div className="text-center">
            <p className="text-[17px] font-medium text-on-surface">Excellent</p>
            <p className="mt-1 text-[13px] leading-relaxed text-on-surface-variant">
              Your memories are protected.
              <br />
              <span className="text-on-surface">{formatBytes(snap.recoverableBytes)}</span> can be
              safely recovered.
            </p>
          </div>
        </Card>

        {/* Recoverable Space */}
        <Card>
          <p className="text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
            Recoverable space
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[34px] font-normal tabular-nums text-on-surface">
              {formatBytes(snap.recoverableBytes)}
            </span>
            <span className="text-[13px] text-on-surface-variant">available to recover</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetaChip icon="schedule" label="Estimated time" value="8 min" />
            <MetaChip icon="tune" label="Recommendation" value="Balanced" />
          </div>
        </Card>

        {/* Scan CTA */}
        <MButton
          size="lg"
          full
          leading={<Symbol name="radar" size={22} />}
          onClick={() => navigate({ to: "/scan" })}
          className="h-16 text-[16px]"
        >
          Scan Storage
        </MButton>

        {/* Quick Actions */}
        <div>
          <SectionHeader title="Quick actions" />
          <div className="mt-2 grid grid-cols-3 gap-3">
            <QuickAction
              icon="image"
              label="Compress Photos"
              onClick={() => navigate({ to: "/scan/results", search: { kind: "photos" } })}
            />
            <QuickAction
              icon="movie"
              label="Compress Videos"
              onClick={() => navigate({ to: "/scan/results", search: { kind: "videos" } })}
            />
            <QuickAction
              icon="folder_zip"
              label="Create ZIP"
              onClick={() => navigate({ to: "/scan/results", search: { kind: "zip" } })}
            />
          </div>
        </div>

        {/* Smart recommendation */}
        <Card className="bg-primary-container">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <Symbol name="auto_awesome" filled className="text-on-primary-container" size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium uppercase tracking-wider text-on-primary-container/80">
                Smart recommendation
              </p>
              <p className="mt-1 text-[15px] font-medium leading-snug text-on-primary-container">
                Compress WhatsApp videos to recover about 6 GB.
              </p>
              <p className="mt-1 text-[12px] text-on-primary-container/80">
                Safe Vault will keep the originals for 30 days.
              </p>
              <MButton
                variant="text"
                size="sm"
                className="mt-2 -ml-3 text-on-primary-container"
                onClick={() => navigate({ to: "/review", search: { bucket: "wa-videos" } })}
              >
                Review files
              </MButton>
            </div>
          </div>
        </Card>

        {/* Storage insights */}
        <div>
          <SectionHeader title="Storage insights" action="See all" to="/scan/results" />
          <div className="mt-2 flex flex-col gap-2">
            {insights.map((b) => (
              <Link
                key={b.id}
                to="/review"
                search={{ bucket: b.id }}
                className="ripple"
              >
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
        </div>

        {/* Recent activity */}
        <div>
          <SectionHeader title="Recent activity" action="Job Center" to="/jobs" />
          <div className="mt-2 flex flex-col gap-2">
            {recent.map((j) => (
              <Card key={j.id} padded={false} className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tertiary-container">
                  <Symbol
                    name="check_circle"
                    filled
                    className="text-on-tertiary-container"
                    size={22}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-on-surface">{j.title}</p>
                  <p className="text-[12px] text-on-surface-variant">
                    Recovered {formatBytes(j.bytesSaved ?? 0)} • {j.finishedAt}
                  </p>
                </div>
                <Symbol name="verified" filled className="text-tertiary" size={20} />
              </Card>
            ))}
          </div>
        </div>

        {/* Safe Vault status */}
        <Link to="/vault" className="ripple">
          <Card className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tertiary-container">
              <Symbol name="shield" filled className="text-on-tertiary-container" size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-on-surface">K-Ai Safe Vault</p>
              <p className="text-[12px] text-on-surface-variant">
                {previewVault.itemCount} items • {formatBytes(previewVault.protectedBytes)}{" "}
                protected
              </p>
            </div>
            <Symbol name="chevron_right" className="text-on-surface-variant" />
          </Card>
        </Link>

        <p className="mt-2 text-center text-[11px] text-on-surface-variant">
          Compression estimated at {formatDuration(8 * 60)}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  action,
  to,
}: {
  title: string;
  action?: string;
  to?: "/scan/results" | "/jobs";
}) {
  return (
    <div className="flex items-end justify-between px-1">
      <h2 className="text-[15px] font-medium text-on-surface">{title}</h2>
      {action && to && (
        <Link to={to} className="text-[13px] font-medium text-primary">
          {action}
        </Link>
      )}
    </div>
  );
}

function MetaChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-3">
      <div className="flex items-center gap-1.5">
        <Symbol name={icon} className="text-on-surface-variant" size={16} />
        <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
      </div>
      <p className="mt-1 text-[15px] font-medium text-on-surface">{value}</p>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ripple flex flex-col items-center gap-2 rounded-3xl bg-surface-1 p-4 text-center shadow-card"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container">
        <Symbol name={icon} filled className="text-on-primary-container" size={22} />
      </div>
      <span className="text-[12px] font-medium leading-tight text-on-surface">{label}</span>
    </button>
  );
}
