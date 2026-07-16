import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Card } from "@/components/Card";
import { Symbol } from "@/components/IconButton";
import { previewJobs } from "@/services/previewData";
import { formatBytes } from "@/lib/format";
import type { Job, JobStatus } from "@/services";

export const Route = createFileRoute("/_app/jobs")({
  component: Jobs,
});

const tabs: { key: JobStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "running", label: "Running" },
  { key: "waiting", label: "Waiting" },
  { key: "completed", label: "Completed" },
  { key: "failed", label: "Failed" },
];

function Jobs() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");
  const list = previewJobs.filter((j) => tab === "all" || j.status === tab);

  return (
    <div className="flex flex-1 flex-col">
      <AppBar title="Job Center" large subtitle="Every task, transparent and verifiable." />

      <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto px-4">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "ripple h-9 shrink-0 rounded-full px-4 text-[13px] font-medium transition " +
                (active
                  ? "bg-secondary text-secondary-foreground"
                  : "border border-border text-on-surface-variant")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 px-4 pb-6">
        {list.length === 0 && (
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <Symbol name="inbox" className="text-on-surface-variant" size={32} />
            <p className="text-[14px] text-on-surface-variant">Nothing here yet.</p>
          </Card>
        )}
        {list.map((j) => (
          <JobCard key={j.id} job={j} />
        ))}
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const meta = statusMeta(job.status);
  return (
    <Card padded={false} className="p-4">
      <div className="flex items-start gap-3">
        <div
          className={
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full " + meta.bg
          }
        >
          <Symbol name={meta.icon} filled className={meta.fg} size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-on-surface">
              {job.title}
            </p>
            <span className={"text-[11px] font-medium uppercase tracking-wider " + meta.fg}>
              {meta.label}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-on-surface-variant">
            {job.itemCount.toLocaleString()} items • {job.finishedAt ?? job.startedAt}
          </p>

          {job.status === "running" && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          )}

          {job.status === "completed" && job.verification && (
            <div className="mt-3 flex items-center gap-2">
              <VerificationBadge kind={job.verification} />
              {job.bytesSaved && (
                <span className="text-[12px] text-on-surface-variant">
                  Recovered {formatBytes(job.bytesSaved)}
                </span>
              )}
            </div>
          )}

          {job.message && job.status !== "completed" && (
            <p className="mt-2 text-[12px] leading-snug text-on-surface-variant">{job.message}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function VerificationBadge({ kind }: { kind: "verified" | "warnings" | "failed" }) {
  const map = {
    verified: { icon: "verified", label: "Verified", bg: "bg-tertiary-container", fg: "text-on-tertiary-container" },
    warnings: { icon: "warning", label: "Completed with warnings", bg: "bg-surface-3", fg: "text-warning" },
    failed: { icon: "error", label: "Failed", bg: "bg-surface-3", fg: "text-destructive" },
  } as const;
  const m = map[kind];
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium " +
        m.bg +
        " " +
        m.fg
      }
    >
      <Symbol name={m.icon} filled size={14} />
      {m.label}
    </span>
  );
}

function statusMeta(s: JobStatus) {
  switch (s) {
    case "running":
      return { icon: "sync", label: "Running", bg: "bg-primary-container", fg: "text-on-primary-container" };
    case "waiting":
      return { icon: "schedule", label: "Waiting", bg: "bg-surface-2", fg: "text-on-surface-variant" };
    case "completed":
      return { icon: "check_circle", label: "Done", bg: "bg-tertiary-container", fg: "text-on-tertiary-container" };
    case "failed":
      return { icon: "error", label: "Failed", bg: "bg-surface-2", fg: "text-destructive" };
  }
}
