import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MButton } from "@/components/MButton";
import { Symbol } from "@/components/IconButton";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

const highlights = [
  {
    icon: "compress",
    title: "Recover space safely",
    body: "We compress photos and videos on-device, so quality stays high.",
  },
  {
    icon: "shield_lock",
    title: "Originals stay protected",
    body: "K-Ai Safe Vault keeps originals for 30 days. Restore anytime.",
  },
  {
    icon: "insights",
    title: "Understand your storage",
    body: "See where space goes and what’s worth recovering first.",
  },
];

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col px-6 pt-16 pb-8">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container">
        <Symbol name="hard_drive_2" filled className="text-on-primary-container" size={36} />
      </div>
      <h1 className="text-[32px] font-normal leading-tight text-on-surface">
        Recover storage,
        <br />
        keep your memories.
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-on-surface-variant">
        K-Ai frees space by compressing what you already have. Nothing leaves your device.
      </p>

      <ul className="mt-8 flex flex-col gap-5">
        {highlights.map((h) => (
          <li key={h.title} className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2">
              <Symbol name={h.icon} className="text-primary" size={22} />
            </div>
            <div>
              <p className="text-[15px] font-medium text-on-surface">{h.title}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-on-surface-variant">
                {h.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2 pt-8">
        <MButton size="lg" full onClick={() => navigate({ to: "/permissions" })}>
          Get started
        </MButton>
        <p className="text-center text-[11px] text-on-surface-variant">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
