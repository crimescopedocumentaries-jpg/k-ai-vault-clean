import { createFileRoute } from "@tanstack/react-router";
import { AppBar } from "@/components/AppBar";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { Symbol } from "@/components/IconButton";
import { previewVault } from "@/services/previewData";
import { formatBytes } from "@/lib/format";

export const Route = createFileRoute("/_app/vault")({
  component: Vault,
});

const groups = [
  { key: "photos", label: "Protected Photos", icon: "image", count: previewVault.items.photos },
  { key: "videos", label: "Protected Videos", icon: "movie", count: previewVault.items.videos },
  {
    key: "deleted",
    label: "Deleted Through K-Ai",
    icon: "delete",
    count: previewVault.items.deletedThroughApp,
  },
];

function Vault() {
  return (
    <div className="flex flex-1 flex-col">
      <AppBar title="Safe Vault" large subtitle="Originals we’re keeping safe for you." />

      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary-container">
              <Symbol name="shield" filled className="text-on-tertiary-container" size={28} />
            </div>
            <div>
              <p className="text-[13px] uppercase tracking-wider text-on-surface-variant">
                Protected
              </p>
              <p className="text-[26px] font-normal tabular-nums leading-none text-on-surface">
                {formatBytes(previewVault.protectedBytes)}
              </p>
              <p className="mt-1 text-[12px] text-on-surface-variant">
                {previewVault.itemCount} items • updated {previewVault.lastUpdated}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <VaultMeta label="Retention" value={`${previewVault.retentionDays} days`} icon="event_repeat" />
            <VaultMeta label="Last change" value={previewVault.lastUpdated} icon="update" />
          </div>

          <MButton size="lg" full leading={<Symbol name="restore" size={20} />}>
            Restore items
          </MButton>
        </Card>

        <div className="flex flex-col gap-2">
          <h2 className="px-1 text-[15px] font-medium text-on-surface">Contents</h2>
          {groups.map((g) => (
            <Card key={g.key} padded={false} className="flex items-center gap-4 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2">
                <Symbol name={g.icon} className="text-primary" size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-on-surface">{g.label}</p>
                <p className="text-[12px] text-on-surface-variant">
                  {g.count.toLocaleString()} items
                </p>
              </div>
              <Symbol name="chevron_right" className="text-on-surface-variant" />
            </Card>
          ))}
        </div>

        <Card className="flex gap-3 bg-surface-2">
          <Symbol name="shield" filled className="mt-0.5 text-tertiary" size={20} />
          <p className="text-[12px] leading-relaxed text-on-surface-variant">
            Original files remain protected until the retention period expires.
            <br />
            Nothing is permanently deleted before then.
          </p>
        </Card>
      </div>
    </div>
  );
}

function VaultMeta({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-3">
      <div className="flex items-center gap-1.5">
        <Symbol name={icon} className="text-on-surface-variant" size={16} />
        <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
      </div>
      <p className="mt-1 text-[14px] font-medium text-on-surface">{value}</p>
    </div>
  );
}
