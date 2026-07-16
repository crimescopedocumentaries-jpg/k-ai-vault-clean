import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { OSS_LICENSES } from "@/lib/appInfo";

export const Route = createFileRoute("/settings/licenses")({
  component: Licenses,
});

const plain =
  "Open source libraries used in K-Ai Storage Saver:\n\n" +
  OSS_LICENSES.map((l) => `${l.name} ${l.version} — ${l.license}`).join("\n");

function Licenses() {
  return (
    <LegalPage
      title="Open Source Licenses"
      header="Built with open source"
      subheader="K-Ai Storage Saver is made possible by these third-party libraries."
      plainText={plain}
    >
      <div className="rounded-3xl bg-surface-1">
        <ul className="divide-y divide-border">
          {OSS_LICENSES.map((l) => (
            <li key={l.name} className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-on-surface">{l.name}</p>
                <p className="text-[12px] text-on-surface-variant">Version {l.version}</p>
              </div>
              <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant">
                {l.license}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </LegalPage>
  );
}
