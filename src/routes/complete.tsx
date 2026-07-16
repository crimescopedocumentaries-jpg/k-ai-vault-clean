import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppBar } from "@/components/AppBar";
import { Card } from "@/components/Card";
import { Symbol } from "@/components/IconButton";
import { MButton } from "@/components/MButton";
import { formatBytes } from "@/lib/format";

export const Route = createFileRoute("/complete")({
  component: Complete,
});

function Complete() {
  const navigate = useNavigate();
  const saved = 8.6 * 1024 ** 3;
  return (
    <div className="flex flex-1 flex-col">
      <AppBar title="Done" />
      <div className="flex flex-1 flex-col items-center gap-6 px-6 pt-6 pb-8 text-center">
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full bg-tertiary-container"
          style={{ animation: "check-in 700ms cubic-bezier(0.2,0.7,0.2,1) both" }}
        >
          <Symbol name="check" filled className="text-on-tertiary-container" size={56} />
        </div>

        <div>
          <h1 className="text-[26px] font-normal leading-tight text-on-surface">Excellent!</h1>
          <p className="mt-2 text-[15px] text-on-surface-variant">
            <span className="font-medium text-on-surface">{formatBytes(saved)}</span> recovered.
            <br />
            Originals remain protected.
          </p>
        </div>

        <Card padded={false} className="grid w-full grid-cols-3 divide-x divide-border">
          <Stat label="Recovered" value={formatBytes(saved)} />
          <Stat label="Files" value="128" />
          <Stat label="Verified" value="128" />
        </Card>

        <Card className="flex w-full items-center gap-3 bg-tertiary-container text-left">
          <Symbol name="verified" filled className="text-on-tertiary-container" size={24} />
          <p className="text-[13px] leading-snug text-on-tertiary-container">
            Compression verified. Every file was checked for integrity before finishing.
          </p>
        </Card>

        <div className="mt-auto flex w-full flex-col gap-2">
          <MButton size="lg" full onClick={() => navigate({ to: "/home" })}>
            Back to home
          </MButton>
          <MButton variant="text" full onClick={() => navigate({ to: "/vault" })}>
            View originals in Safe Vault
          </MButton>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4">
      <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">{label}</p>
      <p className="mt-1 text-[16px] font-medium tabular-nums text-on-surface">{value}</p>
    </div>
  );
}
