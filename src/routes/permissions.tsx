import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MButton } from "@/components/MButton";
import { Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { previewPermissions } from "@/services/previewData";

export const Route = createFileRoute("/permissions")({
  component: Permissions,
});

function Permissions() {
  const navigate = useNavigate();
  const [perms, setPerms] = useState(previewPermissions);

  const grant = (key: string) =>
    setPerms((p) => p.map((x) => (x.key === key ? { ...x, granted: true } : x)));

  const allGranted = perms.every((p) => p.granted);

  return (
    <div className="flex flex-1 flex-col px-6 pt-14 pb-8">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary-container">
        <Symbol name="verified_user" filled className="text-on-tertiary-container" size={30} />
      </div>
      <h1 className="text-[26px] font-normal leading-tight text-on-surface">
        A few permissions
      </h1>
      <p className="mt-2 text-[14px] text-on-surface-variant">
        K-Ai needs access to work with your files. Everything stays on your device.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {perms.map((p) => (
          <Card key={p.key} padded={false} className="flex items-center gap-4 p-4">
            <div
              className={
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full " +
                (p.granted ? "bg-tertiary-container" : "bg-surface-2")
              }
            >
              <Symbol
                name={p.granted ? "check" : "lock"}
                className={p.granted ? "text-on-tertiary-container" : "text-on-surface-variant"}
                size={20}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-on-surface">{p.label}</p>
              <p className="text-[12px] leading-snug text-on-surface-variant">
                {p.description}
              </p>
            </div>
            <MButton
              variant={p.granted ? "text" : "tonal"}
              size="sm"
              disabled={p.granted}
              onClick={() => grant(p.key)}
            >
              {p.granted ? "Granted" : "Allow"}
            </MButton>
          </Card>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-8">
        <MButton size="lg" full disabled={!allGranted} onClick={() => navigate({ to: "/home" })}>
          Continue
        </MButton>
        <button
          type="button"
          className="ripple py-2 text-center text-[13px] text-on-surface-variant"
          onClick={() => navigate({ to: "/home" })}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
