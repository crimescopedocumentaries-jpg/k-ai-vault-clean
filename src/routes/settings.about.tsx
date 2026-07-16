import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppBar } from "@/components/AppBar";
import { Card } from "@/components/Card";
import { IconButton, Symbol } from "@/components/IconButton";
import { MButton } from "@/components/MButton";
import { APP_INFO } from "@/lib/appInfo";

export const Route = createFileRoute("/settings/about")({
  component: AboutKAi,
  head: () => ({
    meta: [
      { title: "About K-Ai — Safe on-device storage recovery" },
      {
        name: "description",
        content:
          "About K-Ai Storage Saver: on-device AI compression, Safe Vault protection, and non-destructive recovery for Android.",
      },
      { property: "og:title", content: "About K-Ai — Safe on-device storage recovery" },
      { property: "og:description", content: "On-device AI compression with Safe Vault protection." },
      { property: "og:url", content: "https://k-ai-vault-clean.lovable.app/settings/about" },
    ],
    links: [{ rel: "canonical", href: "https://k-ai-vault-clean.lovable.app/settings/about" }],
  }),
});

const features = [
  { name: "AI Storage Advisor", icon: "insights" },
  { name: "AI Compression Advisor", icon: "auto_awesome" },
  { name: "Safe Vault", icon: "shield" },
  { name: "ZIP Compression", icon: "folder_zip" },
  { name: "Undo", icon: "undo" },
  { name: "Restore", icon: "restore" },
  { name: "Storage Insights", icon: "monitoring" },
  { name: "Offline Processing", icon: "wifi_off" },
] as const;

function AboutKAi() {
  const navigate = useNavigate();

  const openMail = (to: string, subject: string) => {
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <AppBar
        title="About K-Ai"
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/settings" })}>
            <Symbol name="arrow_back" />
          </IconButton>
        }
      />

      <div className="flex flex-col gap-4 px-4 pb-10">
        {/* Hero */}
        <Card className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-primary-container">
            <Symbol name="auto_awesome" filled size={40} className="text-on-primary-container" />
          </div>
          <div>
            <h2 className="text-[22px] font-medium text-on-surface">{APP_INFO.name}</h2>
            <p className="text-[12px] text-on-surface-variant">
              Version {APP_INFO.version} • Build {APP_INFO.buildNumber}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 text-[13px] text-on-surface-variant">
            {APP_INFO.tagline.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="pt-2 text-[13px] leading-relaxed text-on-surface-variant">
            {APP_INFO.name} helps you safely recover storage space by intelligently compressing
            photos and videos while protecting the originals inside Safe Vault. Everything
            happens completely offline on your device. No account required. No cloud processing.
          </p>
        </Card>

        {/* Application information */}
        <Section title="Application information">
          <InfoRow label="Current version" value={APP_INFO.version} />
          <InfoRow label="Build number" value={APP_INFO.buildNumber} />
          <InfoRow label="Android version" value={APP_INFO.androidVersion} />
          <InfoRow label="Storage engine" value={APP_INFO.storageEngineVersion} />
          <InfoRow label="Safe Vault" value={APP_INFO.safeVaultVersion} />
          <InfoRow label="Database" value={`v${APP_INFO.databaseVersion}`} />
        </Section>

        {/* Features */}
        <Section title="Features">
          <div className="grid grid-cols-2 gap-2 p-3">
            {features.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-2 rounded-2xl bg-surface-2 px-3 py-2.5"
              >
                <Symbol name={f.icon} size={20} className="text-primary" />
                <span className="text-[13px] font-medium text-on-surface">{f.name}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Support */}
        <Section title="Support">
          <SupportRow
            icon="business"
            label="Developer"
            value={APP_INFO.developer}
          />
          <SupportRow
            icon="language"
            label="Website"
            value={APP_INFO.website.replace(/^https?:\/\//, "")}
            onClick={() => window.open(APP_INFO.website, "_blank", "noopener,noreferrer")}
          />
          <SupportRow
            icon="mail"
            label="Support email"
            value={APP_INFO.supportEmail}
            onClick={() => openMail(APP_INFO.supportEmail, "K-Ai Support Request")}
          />
          <SupportRow
            icon="bug_report"
            label="Report a bug"
            onClick={() => navigate({ to: "/settings/report-bug" })}
          />
          <SupportRow
            icon="rate_review"
            label="Send feedback"
            onClick={() => navigate({ to: "/settings/feedback" })}
          />
          <SupportRow
            icon="star"
            label="Rate app"
            onClick={() =>
              window.open(APP_INFO.playStoreUrl, "_blank", "noopener,noreferrer")
            }
          />
        </Section>

        {/* Legal */}
        <Section title="Legal">
          <LinkRow to="/settings/licenses" icon="description" label="Open source licenses" />
          <LinkRow to="/settings/privacy" icon="policy" label="Privacy Policy" />
          <LinkRow to="/settings/terms" icon="gavel" label="Terms of Use" />
        </Section>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <MButton
            variant="tonal"
            full
            leading={<Symbol name="system_update" size={18} />}
            onClick={() =>
              window.open(APP_INFO.playStoreUrl, "_blank", "noopener,noreferrer")
            }
          >
            Check for updates
          </MButton>
          <MButton
            variant="outlined"
            full
            leading={<Symbol name="history" size={18} />}
            onClick={() => navigate({ to: "/settings/changelog" })}
          >
            View changelog
          </MButton>
          <MButton
            variant="text"
            full
            leading={<Symbol name="support_agent" size={18} />}
            onClick={() => openMail(APP_INFO.supportEmail, "K-Ai Support Request")}
          >
            Contact support
          </MButton>
        </div>

        <p className="pt-2 text-center text-[11px] text-on-surface-variant">
          © {new Date().getFullYear()} {APP_INFO.developer}. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="px-2 pb-1.5 text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
        {title}
      </h3>
      <Card padded={false} className="divide-y divide-border">
        {children}
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-on-surface-variant">{label}</span>
      <span className="text-[13px] font-medium tabular-nums text-on-surface">{value}</span>
    </div>
  );
}

function SupportRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: string;
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  const Interactive = onClick ? "button" : "div";
  return (
    <Interactive
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={
        "flex w-full items-center gap-3 p-4 text-left " +
        (onClick ? "ripple" : "")
      }
    >
      <Symbol name={icon} size={20} className="text-on-surface-variant" />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-on-surface-variant">{label}</p>
        {value && <p className="truncate text-[14px] font-medium text-on-surface">{value}</p>}
      </div>
      {onClick && <Symbol name="chevron_right" size={20} className="text-on-surface-variant" />}
    </Interactive>
  );
}

function LinkRow({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link to={to} className="ripple flex w-full items-center gap-3 p-4">
      <Symbol name={icon} size={20} className="text-on-surface-variant" />
      <span className="flex-1 text-[14px] font-medium text-on-surface">{label}</span>
      <Symbol name="chevron_right" size={20} className="text-on-surface-variant" />
    </Link>
  );
}
