import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection, BulletList } from "@/components/LegalPage";
import { APP_INFO } from "@/lib/appInfo";

export const Route = createFileRoute("/settings/terms")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "Terms of Use — K-Ai Storage Saver" },
      {
        name: "description",
        content:
          "The terms that govern your use of the K-Ai Storage Saver app for Android.",
      },
      { property: "og:title", content: "Terms of Use — K-Ai Storage Saver" },
      { property: "og:description", content: "Terms governing use of the K-Ai app." },
      { property: "og:url", content: "https://k-ai-vault-clean.lovable.app/settings/terms" },
    ],
    links: [{ rel: "canonical", href: "https://k-ai-vault-clean.lovable.app/settings/terms" }],
  }),
});

const plain = `${APP_INFO.name} — Terms of Use
Version ${APP_INFO.version} • Effective ${APP_INFO.effectiveDate}
Support: ${APP_INFO.supportEmail}`;

function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      header="Welcome to K-Ai."
      subheader="Please read these Terms carefully before using the application."
      plainText={plain}
      footer={
        <div className="flex flex-col gap-1">
          <span>Version {APP_INFO.version}</span>
          <span>Effective {APP_INFO.effectiveDate}</span>
          <a
            href={`mailto:${APP_INFO.supportEmail}`}
            className="text-primary underline underline-offset-2"
          >
            Contact support — {APP_INFO.supportEmail}
          </a>
        </div>
      }
    >
      <LegalSection title="Acceptance of terms">
        <p>
          By installing or using {APP_INFO.name}, you agree to these Terms. If you do not
          agree, please stop using the application.
        </p>
      </LegalSection>

      <LegalSection title="Application purpose">
        <p>
          {APP_INFO.name} helps you recover storage space by intelligently compressing your
          own photos and videos on device, and by protecting every original inside Safe Vault
          until the retention period you configure ends.
        </p>
      </LegalSection>

      <LegalSection title="User responsibilities">
        <BulletList
          items={[
            "You confirm that you own or have permission to modify the files you compress.",
            "You are responsible for maintaining independent backups of important media.",
            "You will not attempt to reverse-engineer or misuse the application.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Safe use">
        <p>
          Compression and deletion actions can be undone within Safe Vault while originals
          are still protected. Once the retention period ends, deletions become permanent —
          please review Safe Vault before that happens.
        </p>
      </LegalSection>

      <LegalSection title="Data responsibility">
        <p>
          All data stays on your device. {APP_INFO.name} does not upload, sync, or share your
          files, and does not maintain a copy of your media outside your device.
        </p>
      </LegalSection>

      <LegalSection title="Limitations">
        <BulletList
          items={[
            "The application is provided on an as-is basis, without warranties of any kind.",
            "We are not liable for data loss caused by hardware failure, third-party apps, or user error.",
            "Some features may depend on your Android version and available storage.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Disclaimer">
        <p>
          To the fullest extent permitted by law, {APP_INFO.name} and its authors disclaim all
          implied warranties, including fitness for a particular purpose and non-infringement.
          Your use of the application is at your own discretion and risk.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
