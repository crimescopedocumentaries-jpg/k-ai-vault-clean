import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { StorageRing } from "@/components/StorageRing";
import { previewSnapshot, previewBuckets, previewVault, previewJobs } from "@/services/previewData";
import { formatBytes } from "@/lib/format";

export const Route = createFileRoute("/_app/home")({
  component: Home,
});

type ScanState = "idle" | "scanned" | "recovered";
// Preview: shape reflects the "before scan" state on the dashboard.
const state: ScanState = "idle";

function healthLabel(score: number) {
  if (score >= 85) return { word: "Excellent", tone: "text-tertiary" };
  if (score >= 70) return { word: "Good", tone: "text-primary" };
  if (score >= 50) return { word: "Fair", tone: "text-warning" };
  return { word: "Needs attention", tone: "text-destructive" };
}

function Home() {
  const navigate = useNavigate();
  const snap = previewSnapshot;
  const insights = previewBuckets.slice(0, 4);
  const recent = previewJobs.filter((j) => j.status === "completed").slice(0, 3);
  const health = healthLabel(snap.healthScore);

  const photosBytes = snap.breakdown.find((b) => b.category === "photos")?.bytes ?? 0;
  const videosBytes = snap.breakdown.find((b) => b.category === "videos")?.bytes ?? 0;
  const otherBytes =
    snap.usedBytes - photosBytes - videosBytes > 0
      ? snap.usedBytes - photosBytes - videosBytes
      : 0;

  const primary =
    state === "idle"
      ? { label: "Scan Storage", icon: "radar", to: "/scan" as const }
      : state === "scanned"
        ? {
            label: `Recover ${formatBytes(snap.recoverableBytes)}`,
            icon: "compress",
            to: "/compress" as const,
          }
        : { label: "Recover more space", icon: "radar", to: "/scan" as const };

  return (
    <div className="flex flex-1 flex-col">
      <AppBar
        title="K-Ai — Storage Dashboard"
        leading={
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container">
            <Symbol name="hard_drive_2" filled className="text-on-primary-container" size={20} />
          </div>
        }
        trailing={
          <IconButton label="Notifications">
            <Symbol name="notifications" />
          </IconButton>
        }
      />

      <div className="flex flex-col gap-4 px-4 pb-6">
        {/* 1 + 2 — Storage Health & Ring */}
        <Card className="flex flex-col items-center gap-4 py-6">
          <div className="flex items-center gap-2 self-start">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary-container">
              <Symbol name="ecg_heart" filled className="text-on-tertiary-container" size={16} />
            </span>
            <p className="text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
              Storage Health
            </p>
          </div>

          <div className="text-center">
            <p className={`text-[28px] font-normal leading-none ${health.tone}`}>{health.word}</p>
            <p className="mt-1 text-[12px] text-on-surface-variant">Score {snap.healthScore} / 100</p>
          </div>

          <StorageRing score={snap.healthScore} size={200} />

          <div className="grid w-full grid-cols-3 gap-2 pt-1">
            <UsageChip color="var(--color-primary)" label="Photos" value={formatBytes(photosBytes)} />
            <UsageChip color="var(--color-tertiary)" label="Videos" value={formatBytes(videosBytes)} />
            <UsageChip
              color="var(--color-on-surface-variant)"
              label="Other"
              value={formatBytes(otherBytes)}
            />
          </div>

          <p className="px-2 text-center text-[13px] leading-relaxed text-on-surface-variant">
            <span className="text-on-surface">{formatBytes(snap.usedBytes)}</span> used ·{" "}
            <span className="text-on-surface">{formatBytes(snap.freeBytes)}</span> free
            <br />
            <span className="text-on-surface">{formatBytes(snap.recoverableBytes)}</span> can be
            safely recovered.
          </p>
        </Card>

        {/* 3 — Recoverable Space */}
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

        {/* 4 — Contextual primary action */}
        <MButton
          size="lg"
          full
          leading={<Symbol name={primary.icon} size={22} />}
          onClick={() => navigate({ to: primary.to })}
          className="h-16 text-[16px]"
        >
          {primary.label}
        </MButton>

        {/* 5 — Quick Actions */}
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

        {/* 6 — Smart Recommendation (single) */}
        <Card className="bg-primary-container">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <Symbol name="auto_awesome" filled className="text-on-primary-container" size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium uppercase tracking-wider text-on-primary-container/80">
                Recommendation
              </p>
              <p className="mt-1 text-[15px] font-medium leading-snug text-on-primary-container">
                Compress WhatsApp videos
              </p>
              <p className="mt-1 text-[12px] text-on-primary-container/80">
                Estimated recovery · 6.1 GB. Originals stay protected for 30 days.
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

        {/* 7 — Storage Insights */}
        <div>
          <SectionHeader title="Storage insights" action="See all" to="/scan/results" />
          <div className="mt-2 flex flex-col gap-2">
            {insights.map((b) => (
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

        {/* 8 — Recent Activity */}
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
                    Recovered {formatBytes(j.bytesSaved ?? 0)} · {j.finishedAt}
                  </p>
                </div>
                <Symbol name="verified" filled className="text-tertiary" size={20} />
              </Card>
            ))}
          </div>
        </div>

        {/* Last Scan card */}
        <Card padded={false} className="flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-2">
            <Symbol name="history" className="text-primary" size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-on-surface">Last scan</p>
            <p className="text-[12px] text-on-surface-variant">Today · 8:42 PM</p>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium tabular-nums text-primary">5.2 GB</p>
            <p className="text-[11px] text-on-surface-variant">recovered</p>
          </div>
        </Card>

        {/* 9 — Safe Vault status */}
        <Link to="/vault" className="ripple">
          <Card className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tertiary-container">
              <Symbol name="shield" filled className="text-on-tertiary-container" size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-on-surface">K-Ai Safe Vault</p>
              <p className="text-[12px] text-on-surface-variant">
                {previewVault.itemCount} items · {formatBytes(previewVault.protectedBytes)}{" "}
                protected
              </p>
            </div>
            <Symbol name="chevron_right" className="text-on-surface-variant" />
          </Card>
        </Link>
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

function UsageChip({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-3">
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="h-2 w-2 rounded-full"
          style={{ background: color }}
        />
        <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
      </div>
      <p className="mt-1 text-[14px] font-medium tabular-nums text-on-surface">{value}</p>
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
      className="ripple flex min-h-[96px] flex-col items-center gap-2 rounded-3xl bg-surface-1 p-4 text-center shadow-card"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container">
        <Symbol name={icon} filled className="text-on-primary-container" size={22} />
      </div>
      <span className="text-[12px] font-medium leading-tight text-on-surface">{label}</span>
    </button>
  );
}
