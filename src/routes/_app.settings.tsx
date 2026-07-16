import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Card } from "@/components/Card";
import { Symbol } from "@/components/IconButton";
import type { CompressionQuality } from "@/services";

export const Route = createFileRoute("/_app/settings")({
  component: Settings,
});

function Settings() {
  const [quality, setQuality] = useState<CompressionQuality>("balanced");
  const [keepOriginals, setKeepOriginals] = useState(true);
  const [vaultEnabled, setVaultEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [retention, setRetention] = useState(30);
  const [theme, setTheme] = useState<"system" | "dark" | "light">("dark");

  return (
    <div className="flex flex-1 flex-col">
      <AppBar title="Settings" large />

      <div className="flex flex-col gap-4 px-4 pb-6">
        {/* Device information — replaces user profile card */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container">
              <Symbol name="smartphone" filled className="text-on-primary-container" size={24} />
            </div>
            <div>
              <p className="text-[15px] font-medium text-on-surface">This device</p>
              <p className="text-[12px] text-on-surface-variant">Android 15 • 128 GB</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Meta label="Vault" value="Enabled" />
            <Meta label="App version" value="1.0.0" />
          </div>
        </Card>

        <Section title="Compression">
          <SelectRow
            label="Compression quality"
            value={quality}
            onChange={(v) => setQuality(v as CompressionQuality)}
            options={[
              { value: "high", label: "High quality" },
              { value: "balanced", label: "Balanced" },
              { value: "maximum", label: "Maximum savings" },
            ]}
          />
          <SwitchRow
            label="Keep originals"
            description="Store originals until you delete them yourself."
            value={keepOriginals}
            onChange={setKeepOriginals}
          />
        </Section>

        <Section title="Safe Vault">
          <SwitchRow
            label="Enable Safe Vault"
            description="Protects originals for a retention period."
            value={vaultEnabled}
            onChange={setVaultEnabled}
          />
          <SelectRow
            label="Retention period"
            value={String(retention)}
            onChange={(v) => setRetention(Number(v))}
            options={[
              { value: "7", label: "7 days" },
              { value: "30", label: "30 days" },
              { value: "60", label: "60 days" },
              { value: "90", label: "90 days" },
            ]}
          />
        </Section>

        <Section title="Notifications & appearance">
          <SwitchRow
            label="Notifications"
            description="Get notified when a long job finishes."
            value={notifications}
            onChange={setNotifications}
          />
          <SelectRow
            label="Theme"
            value={theme}
            onChange={(v) => setTheme(v as typeof theme)}
            options={[
              { value: "system", label: "Follow system" },
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
          />
        </Section>

        <Section title="About">
          <LinkRow label="Privacy policy" icon="policy" />
          <LinkRow label="Terms of use" icon="description" />
          <LinkRow label="About K-Ai" icon="info" />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="px-2 pb-1.5 text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
        {title}
      </h2>
      <Card padded={false} className="divide-y divide-border">
        {children}
      </Card>
    </div>
  );
}

function SwitchRow({
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

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-on-surface">{label}</p>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ripple h-9 appearance-none rounded-full bg-surface-2 pl-4 pr-9 text-[13px] font-medium text-on-surface outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-surface text-on-surface">
              {o.label}
            </option>
          ))}
        </select>
        <Symbol
          name="expand_more"
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant"
          size={18}
        />
      </div>
    </label>
  );
}

function LinkRow({ label, icon }: { label: string; icon: string }) {
  return (
    <button className="ripple flex w-full items-center gap-3 p-4 text-left">
      <Symbol name={icon} className="text-on-surface-variant" size={20} />
      <span className="flex-1 text-[14px] font-medium text-on-surface">{label}</span>
      <Symbol name="chevron_right" className="text-on-surface-variant" size={20} />
    </button>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-3">
      <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">{label}</p>
      <p className="mt-1 text-[14px] font-medium text-on-surface">{value}</p>
    </div>
  );
}
