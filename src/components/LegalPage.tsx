import { useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { MButton } from "@/components/MButton";

type Props = {
  title: string;
  header?: string;
  subheader?: string;
  children: ReactNode;
  /** Plain-text version used for Copy / Share actions. */
  plainText: string;
  footer?: ReactNode;
  showActions?: boolean;
};

/** Shared Material 3 detail screen for About / Privacy / Terms / Changelog / Licenses. */
export function LegalPage({
  title,
  header,
  subheader,
  children,
  plainText,
  footer,
  showActions = true,
}: Props) {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      flash("Copied to clipboard");
    } catch {
      flash("Copy failed");
    }
  };

  const onShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({
          title,
          text: plainText,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await onCopy();
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <AppBar
        title={title}
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/settings" })}>
            <Symbol name="arrow_back" />
          </IconButton>
        }
        trailing={
          showActions ? (
            <>
              <IconButton label="Copy" onClick={onCopy}>
                <Symbol name="content_copy" size={20} />
              </IconButton>
              <IconButton label="Share" onClick={onShare}>
                <Symbol name="share" size={20} />
              </IconButton>
            </>
          ) : undefined
        }
      />

      <div className="flex flex-1 flex-col gap-4 px-4 pb-10">
        {(header || subheader) && (
          <div className="pt-1">
            {header && (
              <h2 className="text-[22px] font-normal leading-tight text-on-surface">{header}</h2>
            )}
            {subheader && (
              <p className="mt-1 text-[13px] text-on-surface-variant">{subheader}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">{children}</div>

        {footer && (
          <div className="mt-2 rounded-2xl bg-surface-2 p-4 text-[12px] text-on-surface-variant">
            {footer}
          </div>
        )}

        <div className="pt-2">
          <MButton
            variant="outlined"
            full
            leading={<Symbol name="arrow_back" size={18} />}
            onClick={() => navigate({ to: "/settings" })}
          >
            Back to Settings
          </MButton>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-inverse-surface px-4 py-2 text-[13px] font-medium text-inverse-on-surface shadow-card"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-surface-1 p-5">
      <h3 className="text-[15px] font-medium text-on-surface">{title}</h3>
      <div className="mt-3 flex flex-col gap-2 text-[13.5px] leading-relaxed text-on-surface-variant">
        {children}
      </div>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 pl-1">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <Symbol name="check_circle" size={16} className="mt-0.5 shrink-0 text-primary" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
