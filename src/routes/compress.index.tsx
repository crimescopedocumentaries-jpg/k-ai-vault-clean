import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import type { CompressionQuality } from "@/services";
import { formatBytes, formatDuration } from "@/lib/format";

export const Route = createFileRoute("/compress/")({
  component: CompressOptions,
  validateSearch: (s: Record<string, unknown>) => ({
    bucket: (s.bucket as string) ?? undefined,
  }),
});

const options: {
  key: CompressionQuality;
  title: string;
  body: string;
  save: number;
  eta: number;
}[] = [
  {
    key: "high",
    title: "High quality",
    body: "Barely visible difference. Great for photos you care about.",
    save: 5.4 * 1024 ** 3,
    eta: 12 * 60,
  },
  {
    key: "balanced",
    title: "Balanced",
    body: "Best trade-off. Recommended for most videos.",
    save: 8.6 * 1024 ** 3,
    eta: 8 * 60,
  },
  {
    key: "maximum",
    title: "Maximum savings",
    body: "Smaller files, some visible quality loss.",
    save: 12.1 * 1024 ** 3,
    eta: 6 * 60,
  },
];

function CompressOptions() {
  const navigate = useNavigate();
  const [quality, setQuality] = useState<CompressionQuality>("balanced");
  const [keep, setKeep] = useState(true);
  const [vault, setVault] = useState(true);

  const active = options.find((o) => o.key === quality)!;

  return (
    <div className="flex flex-1 flex-col">
      <AppBar
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/scan/results" })}>
            <Symbol name="arrow_back" />
          </IconButton>
        }
        title="Compression options"
      />

      <div className="flex flex-col gap-4 px-4 pb-6">
        <div className="flex flex-col gap-2">
          {options.map((o) => {
            const active = quality === o.key;
            return (
              <button
                key={o.key}
                onClick={() => setQuality(o.key)}
                className={
                  "ripple w-full rounded-3xl border p-4 text-left transition " +
                  (active
                    ? "border-primary bg-primary-container"
                    : "border-border bg-surface-1")
                }
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 " +
                      (active ? "border-primary bg-primary" : "border-on-surface-variant")
                    }
                  >
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={
                        "text-[15px] font-medium " +
                        (active ? "text-on-primary-container" : "text-on-surface")
                      }
                    >
                      {o.title}
                    </p>
                    <p
                      className={
                        "mt-0.5 text-[12px] leading-snug " +
                        (active ? "text-on-primary-container/85" : "text-on-surface-variant")
                      }
                    >
                      {o.body}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <MiniStat
                    icon="savings"
                    label="Save"
                    value={formatBytes(o.save)}
                    active={active}
                  />
                  <MiniStat
                    icon="schedule"
                    label="Time"
                    value={formatDuration(o.eta)}
                    active={active}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <Card padded={false} className="divide-y divide-border">
          <Toggle
            label="Keep originals in Safe Vault"
            description="Recover full quality at any time in 30 days."
            value={vault}
            onChange={setVault}
          />
          <Toggle
            label="Also keep originals on device"
            description="Uses more space. Turn off to maximise recovery."
            value={keep}
            onChange={setKeep}
          />
        </Card>

        <Card className="flex gap-3 bg-tertiary-container">
          <Symbol name="verified_user" filled className="text-on-tertiary-container mt-0.5" size={20} />
          <p className="text-[12px] leading-relaxed text-on-tertiary-container">
            Compression is on-device. K-Ai verifies every file before removing anything.
          </p>
        </Card>

        <div className="sticky bottom-0 pt-2">
          <MButton
            size="lg"
            full
            leading={<Symbol name="compress" size={20} />}
            onClick={() =>
              navigate({ to: "/compress/progress", search: { quality: active.key } })
            }
          >
            Start compression • Save {formatBytes(active.save)}
          </MButton>
          <p className="mt-2 text-center text-[11px] text-on-surface-variant">
            About {formatDuration(active.eta)} • runs in the background
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
  active,
}: {
  icon: string;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl p-3 " + (active ? "bg-primary/20" : "bg-surface-2")
      }
    >
      <div className="flex items-center gap-1.5">
        <Symbol
          name={icon}
          className={active ? "text-on-primary-container" : "text-on-surface-variant"}
          size={14}
        />
        <span
          className={
            "text-[10px] uppercase tracking-wider " +
            (active ? "text-on-primary-container/85" : "text-on-surface-variant")
          }
        >
          {label}
        </span>
      </div>
      <p
        className={
          "mt-0.5 text-[14px] font-medium " +
          (active ? "text-on-primary-container" : "text-on-surface")
        }
      >
        {value}
      </p>
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="ripple flex w-full items-center gap-4 p-4 text-left"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-on-surface">{label}</p>
        {description && (
          <p className="mt-0.5 text-[12px] text-on-surface-variant">{description}</p>
        )}
      </div>
      <span
        className={
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors " +
          (value ? "bg-primary" : "bg-surface-3")
        }
      >
        <span
          className={
            "absolute h-5 w-5 rounded-full bg-background shadow-card transition-transform " +
            (value ? "translate-x-6" : "translate-x-1")
          }
        />
      </span>
    </button>
  );
}
