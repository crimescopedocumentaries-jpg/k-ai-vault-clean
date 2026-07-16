import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { Symbol } from "@/components/IconButton";
import { CHANGELOG, APP_INFO } from "@/lib/appInfo";

export const Route = createFileRoute("/settings/changelog")({
  component: Changelog,
});

const plain = CHANGELOG.map(
  (r) =>
    `Version ${r.version} — ${r.date}\n` +
    `What's new:\n- ${r.highlights.join("\n- ")}\n` +
    `Improvements:\n- ${r.improvements.join("\n- ")}\n` +
    `Bug fixes:\n- ${r.bugFixes.join("\n- ")}\n` +
    `Performance:\n- ${r.performance.join("\n- ")}\n` +
    `Security:\n- ${r.security.join("\n- ")}`,
).join("\n\n");

function Changelog() {
  return (
    <LegalPage
      title="Changelog"
      header="What's new"
      subheader={`Version history for ${APP_INFO.name}.`}
      plainText={plain}
    >
      {CHANGELOG.map((release, idx) => (
        <section key={release.version} className="rounded-3xl bg-surface-1 p-5">
          <div className="flex items-center gap-2">
            <span
              className={
                "rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
                (idx === 0
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-2 text-on-surface-variant")
              }
            >
              {idx === 0 ? "Newest" : `v${release.version}`}
            </span>
            <h3 className="text-[16px] font-medium text-on-surface">
              Version {release.version}
            </h3>
          </div>
          <p className="mt-1 text-[12px] text-on-surface-variant">{release.date}</p>

          <Group icon="celebration" title="What's new" items={release.highlights} />
          <Group icon="tune" title="Improvements" items={release.improvements} />
          <Group icon="bug_report" title="Bug fixes" items={release.bugFixes} />
          <Group icon="speed" title="Performance" items={release.performance} />
          <Group icon="lock" title="Security" items={release.security} />
        </section>
      ))}
    </LegalPage>
  );
}

function Group({ icon, title, items }: { icon: string; title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <Symbol name={icon} size={16} className="text-primary" />
        <h4 className="text-[13px] font-medium text-on-surface">{title}</h4>
      </div>
      <ul className="mt-1.5 flex flex-col gap-1 pl-6 text-[13px] leading-relaxed text-on-surface-variant">
        {items.map((t) => (
          <li key={t} className="list-disc">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
