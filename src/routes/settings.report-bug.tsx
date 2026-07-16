import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Card } from "@/components/Card";
import { IconButton, Symbol } from "@/components/IconButton";
import { MButton } from "@/components/MButton";
import { APP_INFO } from "@/lib/appInfo";

export const Route = createFileRoute("/settings/report-bug")({
  component: ReportBug,
});

const DEVICE_INFO = {
  app: `${APP_INFO.name} ${APP_INFO.version} (build ${APP_INFO.buildNumber})`,
  android: APP_INFO.androidVersion,
  ua: typeof navigator !== "undefined" ? navigator.userAgent : "n/a",
};

function ReportBug() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [includeDevice, setIncludeDevice] = useState(true);

  const body = useMemo(() => {
    const parts = [
      "Describe the issue:",
      description || "(please describe what went wrong)",
      "",
      "Steps to reproduce:",
      "1. ",
      "2. ",
      "3. ",
    ];
    if (attachment) parts.push("", `Attached screenshot: ${attachment}`);
    if (includeDevice) {
      parts.push("", "— Device information —");
      parts.push(`App: ${DEVICE_INFO.app}`);
      parts.push(`Android: ${DEVICE_INFO.android}`);
      parts.push(`Client: ${DEVICE_INFO.ua}`);
    }
    return parts.join("\n");
  }, [description, attachment, includeDevice]);

  const send = () => {
    const subject = `Bug report — ${APP_INFO.name} ${APP_INFO.version}`;
    window.location.href = `mailto:${APP_INFO.supportEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setAttachment(f ? f.name : null);
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <AppBar
        title="Report a bug"
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/settings" })}>
            <Symbol name="arrow_back" />
          </IconButton>
        }
      />

      <div className="flex flex-col gap-4 px-4 pb-10">
        <p className="text-[13px] text-on-surface-variant">
          Tell us what went wrong. Your report opens in your email app so nothing is sent from
          the device automatically.
        </p>

        <Card>
          <label className="block text-[13px] font-medium text-on-surface">
            Describe the issue
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="What happened? What did you expect?"
            className="mt-2 w-full resize-none rounded-2xl bg-surface-2 p-3 text-[14px] text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </Card>

        <Card padded={false}>
          <label className="ripple flex cursor-pointer items-center gap-3 p-4">
            <Symbol name="image" size={20} className="text-on-surface-variant" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-on-surface">Attach screenshot</p>
              <p className="truncate text-[12px] text-on-surface-variant">
                {attachment ?? "Optional — helps us reproduce the issue"}
              </p>
            </div>
            <input type="file" accept="image/*" onChange={onPickFile} className="hidden" />
            <Symbol name="add" size={20} className="text-on-surface-variant" />
          </label>

          <div className="border-t border-border">
            <button
              type="button"
              onClick={() => setIncludeDevice((v) => !v)}
              className="ripple flex w-full items-center gap-3 p-4 text-left"
            >
              <Symbol name="smartphone" size={20} className="text-on-surface-variant" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-on-surface">
                  Include device information
                </p>
                <p className="text-[12px] text-on-surface-variant">
                  App version, Android version, client string. Optional.
                </p>
              </div>
              <span
                className={
                  "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors " +
                  (includeDevice ? "bg-primary" : "bg-surface-3")
                }
              >
                <span
                  className={
                    "absolute h-5 w-5 rounded-full bg-background shadow-card transition-transform " +
                    (includeDevice ? "translate-x-6" : "translate-x-1")
                  }
                />
              </span>
            </button>
          </div>
        </Card>

        <MButton
          full
          leading={<Symbol name="send" size={18} />}
          disabled={!description.trim()}
          onClick={send}
        >
          Send email
        </MButton>
      </div>
    </div>
  );
}
