import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { previewBuckets, previewMedia } from "@/services/previewData";
import { formatBytes } from "@/lib/format";

export const Route = createFileRoute("/review")({
  component: Review,
  validateSearch: (s: Record<string, unknown>) => ({
    bucket: (s.bucket as string) ?? "wa-videos",
  }),
});

function Review() {
  const navigate = useNavigate();
  const { bucket } = Route.useSearch();
  const bucketMeta = previewBuckets.find((b) => b.id === bucket) ?? previewBuckets[0];
  const [items, setItems] = useState(() => previewMedia(bucketMeta.id));

  const selected = useMemo(() => items.filter((i) => i.selected), [items]);
  const selectedBytes = selected.reduce((a, b) => a + b.bytes, 0);

  const toggle = (id: string) =>
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, selected: !x.selected } : x)));
  const selectAll = (v: boolean) =>
    setItems((arr) => arr.map((x) => ({ ...x, selected: v })));

  return (
    <div className="flex flex-1 flex-col">
      <AppBar
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/scan/results" })}>
            <Symbol name="arrow_back" />
          </IconButton>
        }
        title={bucketMeta.label}
        trailing={
          <IconButton
            label={selected.length === items.length ? "Clear all" : "Select all"}
            onClick={() => selectAll(selected.length !== items.length)}
          >
            <Symbol
              name={selected.length === items.length ? "check_box" : "check_box_outline_blank"}
            />
          </IconButton>
        }
      />

      <div className="px-4 pb-4">
        <Card padded={false} className="flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-container">
            <Symbol name={bucketMeta.icon} filled className="text-on-primary-container" size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-on-surface">
              {selected.length} of {items.length} selected
            </p>
            <p className="text-[12px] text-on-surface-variant">{bucketMeta.sample}</p>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium tabular-nums text-primary">
              {formatBytes(selectedBytes)}
            </p>
            <p className="text-[11px] text-on-surface-variant">to process</p>
          </div>
        </Card>
      </div>

      <ul className="grid grid-cols-3 gap-1 px-1">
        {items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => toggle(it.id)}
              className="ripple relative block aspect-square w-full overflow-hidden rounded-xl bg-surface-2"
            >
              <div className="flex h-full w-full items-center justify-center">
                <Symbol
                  name={it.mimeType.startsWith("video") ? "smart_display" : "image"}
                  className="text-on-surface-variant"
                  size={28}
                />
              </div>
              <span className="absolute bottom-1 left-1 rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-on-surface">
                {formatBytes(it.bytes, 0)}
              </span>
              <span
                className={
                  "absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 " +
                  (it.selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-white/60 bg-background/40")
                }
              >
                {it.selected && <Symbol name="check" size={14} />}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 mt-6 border-t border-border bg-background/95 p-4 backdrop-blur-md">
        <MButton
          size="lg"
          full
          disabled={selected.length === 0}
          leading={<Symbol name="tune" size={20} />}
          onClick={() => navigate({ to: "/compress", search: { bucket } })}
        >
          Continue • {selected.length} items
        </MButton>
      </div>
    </div>
  );
}
