import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Symbol } from "@/components/IconButton";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/welcome" }), 1400);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-container">
        <Symbol name="hard_drive_2" filled className="text-on-primary-container" size={56} />
      </div>
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-on-surface">
          K-Ai Storage Saver
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">Recover safely. Protect memories.</p>
      </div>
      <div className="absolute bottom-16 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-on-surface-variant"
            style={{
              animation: "pulse-soft 1.2s ease-in-out infinite",
              animationDelay: `${i * 180}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
