import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection, BulletList } from "@/components/LegalPage";
import { APP_INFO } from "@/lib/appInfo";

export const Route = createFileRoute("/settings/privacy")({
  component: PrivacyPolicy,
});

const plain = `${APP_INFO.name} — Privacy Policy
Last updated: ${APP_INFO.lastUpdated}
Version: ${APP_INFO.version}
Contact: ${APP_INFO.privacyEmail}

Your privacy comes first. All processing happens on your device. No photos or videos are uploaded. No cloud storage. No account required. No advertising. No analytics.`;

function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      header="Your privacy comes first."
      subheader="A clean, plain-language summary of how K-Ai treats your data."
      plainText={plain}
      footer={
        <div className="flex flex-col gap-1">
          <span>Last updated: {APP_INFO.lastUpdated}</span>
          <span>Version {APP_INFO.version}</span>
          <a
            href={`mailto:${APP_INFO.privacyEmail}`}
            className="text-primary underline underline-offset-2"
          >
            {APP_INFO.privacyEmail}
          </a>
        </div>
      }
    >
      <LegalSection title="Our privacy commitment">
        <BulletList
          items={[
            "All processing happens on your device.",
            "No photos or videos are uploaded.",
            "No cloud storage.",
            "No account required.",
            "No advertising.",
            "No analytics.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Permissions">
        <p>
          <strong className="text-on-surface">Media access</strong> — used only to scan and
          compress files that you select. K-Ai never reads media in the background.
        </p>
        <p>
          <strong className="text-on-surface">Notifications</strong> — used only to let you
          know when a long-running compression or restore job has finished.
        </p>
      </LegalSection>

      <LegalSection title="Your data">
        <BulletList
          items={[
            "Your files remain on your device at all times.",
            "We do not collect your photos.",
            "We do not collect your videos.",
            "We do not collect personal information.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Safe Vault">
        <p>
          Every original photo or video is kept inside Safe Vault for the retention period you
          choose in Settings. Originals stay protected and fully restorable until that period
          ends — nothing is permanently deleted before then.
        </p>
        <p>
          You can restore any protected original at full quality at any time from the Safe
          Vault tab.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
