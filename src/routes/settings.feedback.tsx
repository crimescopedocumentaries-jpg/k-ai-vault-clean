import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Card } from "@/components/Card";
import { IconButton, Symbol } from "@/components/IconButton";
import { MButton } from "@/components/MButton";
import { APP_INFO } from "@/lib/appInfo";

export const Route = createFileRoute("/settings/feedback")({
  component: Feedback,
});

type Kind = "suggestion" | "feature" | "general";

const KINDS: { id: Kind; label: string; icon: string; description: string }[] = [
  {
    id: "suggestion",
    label: "Suggestion",
    icon: "lightbulb",
    description: "Something we could do better.",
  },
  {
    id: "feature",
    label: "Feature request",
    icon: "auto_awesome",
    description: "An idea for a new capability.",
  },
  {
    id: "general",
    label: "General feedback",
    icon: "chat",
    description: "Anything else you'd like to share.",
  },
];

function Feedback() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<Kind>("suggestion");
  const [message, setMessage] = useState("");

  const send = () => {
    const label = KINDS.find((k) => k.id === kind)?.label ?? "Feedback";
    const subject = `${label} — ${APP_INFO.name} ${APP_INFO.version}`;
    window.location.href = `mailto:${APP_INFO.feedbackEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <AppBar
        title="Send feedback"
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/settings" })}>
            <Symbol name="arrow_back" />
          </IconButton>
        }
      />

      <div className="flex flex-col gap-4 px-4 pb-10">
        <p className="text-[13px] text-on-surface-variant">
          We read every message. Your feedback opens in your email app — nothing is sent from
          the device automatically.
        </p>

        <div className="flex flex-col gap-2">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              className={
                "ripple flex items-center gap-3 rounded-2xl p-4 text-left transition " +
                (kind === k.id
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-1 text-on-surface")
              }
            >
              <Symbol
                name={k.icon}
                size={20}
                className={kind === k.id ? "text-on-primary-container" : "text-primary"}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium">{k.label}</p>
                <p
                  className={
                    "text-[12px] " +
                    (kind === k.id ? "opacity-80" : "text-on-surface-variant")
                  }
                >
                  {k.description}
                </p>
              </div>
              {kind === k.id && <Symbol name="check_circle" size={20} filled />}
            </button>
          ))}
        </div>

        <Card>
          <label className="block text-[13px] font-medium text-on-surface">Your message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            placeholder="Share your thoughts…"
            className="mt-2 w-full resize-none rounded-2xl bg-surface-2 p-3 text-[14px] text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </Card>

        <MButton
          full
          leading={<Symbol name="send" size={18} />}
          disabled={!message.trim()}
          onClick={send}
        >
          Send email
        </MButton>
      </div>
    </div>
  );
}
