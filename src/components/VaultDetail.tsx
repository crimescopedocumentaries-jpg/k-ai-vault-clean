import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { formatBytes, formatDuration } from "@/lib/format";
import type { VaultEntry } from "@/services/previewData";

type SortKey = "date" | "name" | "size";
type FilterKey = "newest" | "oldest" | "largest" | "smallest" | "restored";

type Props = {
  title: string;
  subtitleUnit: string; // "Photos" / "Videos" / "Items"
  items: VaultEntry[];
  emptyTitle: string;
  emptyBody: string;
  emptyCta?: { label: string; to: string };
  showDeletedMeta?: boolean;
};

export function VaultDetail({
  title,
  subtitleUnit,
  items,
  emptyTitle,
  emptyBody,
  emptyCta,
  showDeletedMeta,
}: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [filter, setFilter] = useState<FilterKey>("newest");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [preview, setPreview] = useState<VaultEntry | null>(null);
  const [confirmRestoreAll, setConfirmRestoreAll] = useState(false);
  const [restoring, setRestoring] = useState<null | {
    count: number;
    bytes: number;
    progress: number;
    phase: "restoring" | "done";
  }>(null);

  const startRestore = (ids: string[]) => {
    const chosen = items.filter((i) => ids.includes(i.id));
    const bytes = chosen.reduce((a, b) => a + b.bytes, 0);
    setRestoring({ count: chosen.length, bytes, progress: 0, phase: "restoring" });
    const started = Date.now();
    const duration = Math.min(3200, 900 + chosen.length * 120);
    const tick = () => {
      const p = Math.min(1, (Date.now() - started) / duration);
      setRestoring((r) => (r ? { ...r, progress: p } : r));
      if (p < 1) requestAnimationFrame(tick);
      else {
        setRestoring((r) => (r ? { ...r, phase: "done", progress: 1 } : r));
        setTimeout(() => {
          setRestoring(null);
          clearSelection();
        }, 1200);
      }
    };
    requestAnimationFrame(tick);
  };

  const totalBytes = items.reduce((a, b) => a + b.bytes, 0);

  const visible = useMemo(() => {
    let list = items.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.protectedAt.toLowerCase().includes(q),
      );
    }
    switch (filter) {
      case "newest":
        list.sort((a, b) => a.protectedAtDays - b.protectedAtDays);
        break;
      case "oldest":
        list.sort((a, b) => b.protectedAtDays - a.protectedAtDays);
        break;
      case "largest":
        list.sort((a, b) => b.bytes - a.bytes);
        break;
      case "smallest":
        list.sort((a, b) => a.bytes - b.bytes);
        break;
      case "restored":
        list = list.filter((i) => i.protectedAtDays <= 2);
        break;
    }
    if (filter !== "newest" && filter !== "oldest") {
      if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      else if (sort === "size") list.sort((a, b) => b.bytes - a.bytes);
      else if (sort === "date") list.sort((a, b) => a.protectedAtDays - b.protectedAtDays);
    }
    return list;
  }, [items, query, sort, filter]);

  const toggle = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    setSelected(new Set());
    setSelectMode(false);
  };

  const selectedItems = items.filter((i) => selected.has(i.id));
  const selectedBytes = selectedItems.reduce((a, b) => a + b.bytes, 0);

  return (
    <div className="flex flex-1 flex-col pb-24">
      <AppBar
        title={title}
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/vault" })}>
            <Symbol name="arrow_back" />
          </IconButton>
        }
        trailing={
          <IconButton
            label={selectMode ? "Cancel selection" : "Select"}
            onClick={() => {
              if (selectMode) clearSelection();
              else setSelectMode(true);
            }}
          >
            <Symbol name={selectMode ? "close" : "check_box_outline_blank"} />
          </IconButton>
        }
      />

      <div className="flex flex-col gap-3 px-4 pb-4">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary-container">
            <Symbol name="shield" filled className="text-on-tertiary-container" size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] uppercase tracking-wider text-on-surface-variant">
              Protected
            </p>
            <p className="text-[20px] font-normal tabular-nums leading-tight text-on-surface">
              {items.length.toLocaleString()} {subtitleUnit}
            </p>
            <p className="text-[12px] text-on-surface-variant">{formatBytes(totalBytes)} kept safe</p>
          </div>
        </Card>

        <label className="flex items-center gap-2 rounded-2xl bg-surface-2 px-3 py-2.5">
          <Symbol name="search" size={20} className="text-on-surface-variant" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by filename or date"
            aria-label="Search vault"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-on-surface outline-none placeholder:text-on-surface-variant"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="ripple rounded-full p-1"
            >
              <Symbol name="close" size={18} className="text-on-surface-variant" />
            </button>
          )}
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip
            icon="sort"
            label={
              sort === "date" ? "Sort: Date" : sort === "name" ? "Sort: Name" : "Sort: Size"
            }
            onClick={() =>
              setSort((s) => (s === "date" ? "name" : s === "name" ? "size" : "date"))
            }
          />
          {(["newest", "oldest", "largest", "smallest", "restored"] as FilterKey[]).map((f) => (
            <Chip
              key={f}
              label={
                f === "restored"
                  ? "Recently restored"
                  : f.charAt(0).toUpperCase() + f.slice(1)
              }
              selected={filter === f}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-2">
            <Symbol name="shield" className="text-on-surface-variant" size={28} />
          </div>
          <h2 className="text-[18px] font-medium text-on-surface">{emptyTitle}</h2>
          <p className="max-w-xs text-[13px] text-on-surface-variant">{emptyBody}</p>
          {emptyCta && (
            <MButton onClick={() => navigate({ to: emptyCta.to })}>{emptyCta.label}</MButton>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-2 px-4">
          {visible.map((it) => {
            const isSelected = selected.has(it.id);
            return (
              <li key={it.id}>
                <Card
                  padded={false}
                  className={
                    "flex items-center gap-3 p-3 " +
                    (isSelected ? "ring-2 ring-primary" : "")
                  }
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (selectMode) toggle(it.id);
                      else setPreview(it);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectMode(true);
                      toggle(it.id);
                    }}
                    aria-label={`${it.name}, ${formatBytes(it.bytes)}, protected ${it.protectedAt}`}
                    className="flex min-h-11 flex-1 items-center gap-3 text-left"
                  >
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-2">
                      <Symbol
                        name={
                          it.kind === "video"
                            ? "smart_display"
                            : it.kind === "zip"
                              ? "folder_zip"
                              : "image"
                        }
                        className="text-on-surface-variant"
                        size={24}
                      />
                      {it.kind === "video" && it.durationSec && (
                        <span className="absolute bottom-0.5 right-0.5 rounded bg-background/70 px-1 text-[9px] font-medium text-on-surface">
                          {formatDuration(it.durationSec)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-on-surface">{it.name}</p>
                      <p className="text-[12px] text-on-surface-variant">
                        {formatBytes(it.bytes)} • Protected {it.protectedAt}
                      </p>
                      {showDeletedMeta && it.deletedAt && (
                        <p className="text-[11px] text-tertiary">
                          Deleted {it.deletedAt} • {it.retentionDaysLeft}d left
                        </p>
                      )}
                    </div>
                  </button>
                  {selectMode ? (
                    <span
                      className={
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 " +
                        (isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-outline")
                      }
                    >
                      {isSelected && <Symbol name="check" size={16} />}
                    </span>
                  ) : (
                    <IconButton label="Info" onClick={() => setPreview(it)}>
                      <Symbol name="more_vert" />
                    </IconButton>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {selectMode && selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-md items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-on-surface">
                {selected.size} selected
              </p>
              <p className="text-[11px] text-on-surface-variant">{formatBytes(selectedBytes)}</p>
            </div>
            <MButton
              variant="outlined"
              onClick={clearSelection}
              leading={<Symbol name="close" size={18} />}
            >
              Cancel
            </MButton>
            <MButton
              variant="tonal"
              onClick={clearSelection}
              leading={<Symbol name="delete" size={18} />}
            >
              Delete
            </MButton>
            <MButton
              onClick={() => startRestore(Array.from(selected))}
              leading={<Symbol name="restore" size={18} />}
            >
              Restore
            </MButton>
          </div>
        </div>
      )}

      {!selectMode && visible.length > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border bg-background/95 p-3 backdrop-blur-md">
          <div className="mx-auto max-w-md">
            <MButton
              full
              size="lg"
              leading={<Symbol name="restore" size={20} />}
              onClick={() => setConfirmRestoreAll(true)}
            >
              Restore options
            </MButton>
          </div>
        </div>
      )}

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Item details"
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-surface p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex aspect-video items-center justify-center rounded-2xl bg-surface-2">
              <Symbol
                name={
                  preview.kind === "video"
                    ? "smart_display"
                    : preview.kind === "zip"
                      ? "folder_zip"
                      : "image"
                }
                className="text-on-surface-variant"
                size={48}
              />
            </div>
            <p className="truncate text-[16px] font-medium text-on-surface">{preview.name}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <Meta label="Original size" value={formatBytes(preview.bytes)} />
              <Meta label="Protected" value={preview.protectedAt} />
              {preview.durationSec && (
                <Meta label="Duration" value={formatDuration(preview.durationSec)} />
              )}
              {preview.deletedAt && <Meta label="Deleted" value={preview.deletedAt} />}
              {preview.retentionDaysLeft != null && (
                <Meta label="Retention left" value={`${preview.retentionDaysLeft} days`} />
              )}
            </dl>
            <div className="mt-5 flex gap-2">
              <MButton
                variant="outlined"
                full
                leading={<Symbol name="delete" size={18} />}
                onClick={() => setPreview(null)}
              >
                Delete
              </MButton>
              <MButton
                full
                leading={<Symbol name="restore" size={18} />}
                onClick={() => {
                  const id = preview.id;
                  setPreview(null);
                  startRestore([id]);
                }}
              >
                Restore
              </MButton>
            </div>
          </div>
        </div>
      )}

      {confirmRestoreAll && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Restore options"
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onClick={() => setConfirmRestoreAll(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-surface p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[18px] font-medium text-on-surface">Restore options</h2>
            <p className="mt-1 text-[13px] text-on-surface-variant">
              Choose what to restore from Safe Vault.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <MButton
                variant="tonal"
                full
                disabled={selected.size === 0}
                leading={<Symbol name="check" size={18} />}
                onClick={() => setConfirmRestoreAll(false)}
              >
                Restore selected ({selected.size})
              </MButton>
              <MButton
                variant="tonal"
                full
                leading={<Symbol name="image" size={18} />}
                onClick={() => setConfirmRestoreAll(false)}
              >
                Restore all photos
              </MButton>
              <MButton
                variant="tonal"
                full
                leading={<Symbol name="movie" size={18} />}
                onClick={() => setConfirmRestoreAll(false)}
              >
                Restore all videos
              </MButton>
              <MButton
                full
                leading={<Symbol name="restore" size={18} />}
                onClick={() => {
                  if (
                    typeof window !== "undefined" &&
                    !window.confirm("Restore everything from Safe Vault?")
                  )
                    return;
                  setConfirmRestoreAll(false);
                }}
              >
                Restore everything
              </MButton>
              <MButton
                variant="outlined"
                full
                onClick={() => setConfirmRestoreAll(false)}
              >
                Cancel
              </MButton>
            </div>
          </div>
        </div>
      )}

      {restoring && (
        <div
          role="dialog"
          aria-modal="true"
          aria-live="polite"
          aria-label={restoring.phase === "done" ? "Restore complete" : "Restoring items"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 text-center shadow-card">
            <div className="relative mx-auto mb-5 h-24 w-24">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-surface-2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={2 * Math.PI * 44 * (1 - restoring.progress)}
                  className="stroke-primary transition-[stroke-dashoffset] duration-100 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {restoring.phase === "done" ? (
                  <Symbol
                    name="check_circle"
                    filled
                    size={44}
                    className="text-primary animate-in zoom-in duration-300"
                  />
                ) : (
                  <Symbol
                    name="restore"
                    size={36}
                    className="text-primary animate-pulse"
                  />
                )}
              </div>
            </div>
            <h2 className="text-[18px] font-medium text-on-surface">
              {restoring.phase === "done" ? "Restored" : "Restoring…"}
            </h2>
            <p className="mt-1 text-[13px] text-on-surface-variant">
              {restoring.phase === "done"
                ? `${restoring.count} item${restoring.count === 1 ? "" : "s"} returned to your gallery`
                : `${restoring.count} item${restoring.count === 1 ? "" : "s"} • ${formatBytes(restoring.bytes)}`}
            </p>
            {restoring.phase === "restoring" && (
              <p className="mt-3 text-[12px] tabular-nums text-on-surface-variant">
                {Math.round(restoring.progress * 100)}%
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "ripple flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors " +
        (selected
          ? "border-primary bg-primary-container text-on-primary-container"
          : "border-outline bg-surface text-on-surface")
      }
    >
      {icon && <Symbol name={icon} size={16} />}
      {label}
    </button>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-2.5">
      <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-medium text-on-surface">{value}</dd>
    </div>
  );
}
