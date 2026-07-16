import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppBar } from "@/components/AppBar";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { Symbol } from "@/components/IconButton";
import { previewVault, previewVaultBytes } from "@/services/previewData";
import { formatBytes } from "@/lib/format";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/_app/vault/")({
  component: Vault,
});

const groups = [
  {
    key: "photos",
    label: "Protected Photos",
    icon: "image",
    count: previewVault.items.photos,
    bytes: previewVaultBytes.photos,
    to: "/vault/photos",
  },
  {
    key: "videos",
    label: "Protected Videos",
    icon: "movie",
    count: previewVault.items.videos,
    bytes: previewVaultBytes.videos,
    to: "/vault/videos",
  },
  {
    key: "deleted",
    label: "Deleted Through K-Ai",
    icon: "delete",
    count: previewVault.items.deletedThroughApp,
    bytes: previewVaultBytes.deletedThroughApp,
    to: "/vault/deleted",
  },
] as const;

function Vault() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const handleRestoreAll = () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `Restore all ${previewVault.itemCount} items (${formatBytes(previewVault.protectedBytes)}) from Safe Vault?`,
      )
    )
      return;
    setRestoreOpen(false);
    showToast("Restoring all items to your gallery…");
  };

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
            <VaultMeta label="Retention" value={`${settings.retentionDays} days`} icon="event_repeat" />
            <VaultMeta label="Last change" value={previewVault.lastUpdated} icon="update" />
          </div>

          <MButton
            size="lg"
            full
            leading={<Symbol name="restore" size={20} />}
            onClick={() => setRestoreOpen(true)}
          >
            Restore items
          </MButton>
        </Card>

        <div className="flex flex-col gap-2">
          <h2 className="px-1 text-[15px] font-medium text-on-surface">Contents</h2>
          {groups.map((g) => (
            <Link
              key={g.key}
              to={g.to}
              className="ripple block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`${g.label}, ${g.count.toLocaleString()} items, ${formatBytes(g.bytes)} protected`}
            >
              <Card padded={false} className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2">
                  <Symbol name={g.icon} className="text-primary" size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-on-surface">{g.label}</p>
                  <p className="text-[12px] text-on-surface-variant">
                    {g.count.toLocaleString()} items • {formatBytes(g.bytes)} protected
                  </p>
                </div>
                <Symbol name="chevron_right" className="text-on-surface-variant" />
              </Card>
            </Link>
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

      {restoreOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Restore items"
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onClick={() => setRestoreOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-surface p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[18px] font-medium text-on-surface">Restore items</h2>
            <p className="mt-1 text-[13px] text-on-surface-variant">
              Choose what to restore from Safe Vault. Restored originals return to your gallery.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <MButton
                variant="tonal"
                full
                leading={<Symbol name="image" size={18} />}
                onClick={() => {
                  setRestoreOpen(false);
                  navigate({ to: "/vault/photos" });
                }}
              >
                Choose photos to restore
              </MButton>
              <MButton
                variant="tonal"
                full
                leading={<Symbol name="movie" size={18} />}
                onClick={() => {
                  setRestoreOpen(false);
                  navigate({ to: "/vault/videos" });
                }}
              >
                Choose videos to restore
              </MButton>
              <MButton
                variant="tonal"
                full
                leading={<Symbol name="delete" size={18} />}
                onClick={() => {
                  setRestoreOpen(false);
                  navigate({ to: "/vault/deleted" });
                }}
              >
                Recover deleted items
              </MButton>
              <MButton
                full
                leading={<Symbol name="restore" size={18} />}
                onClick={handleRestoreAll}
              >
                Restore everything ({formatBytes(previewVault.protectedBytes)})
              </MButton>
              <MButton variant="outlined" full onClick={() => setRestoreOpen(false)}>
                Cancel
              </MButton>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4"
        >
          <div className="flex items-center gap-2 rounded-full bg-inverse-surface px-4 py-2 text-[13px] text-inverse-on-surface shadow-lg">
            <Symbol name="check_circle" size={18} />
            {toast}
          </div>
        </div>
      )}
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
