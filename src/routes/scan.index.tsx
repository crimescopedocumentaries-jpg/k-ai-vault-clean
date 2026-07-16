import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";

export const Route = createFileRoute("/scan")({
  component: Scan,
});

const stages = [
  "Checking permissions",
  "Reading media library",
  "Analysing videos",
  "Analysing photos",
  "Scoring recoverable space",
];

function Scan() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(4);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 3 + Math.random() * 4);
        setStage(Math.min(stages.length - 1, Math.floor((next / 100) * stages.length)));
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => navigate({ to: "/scan/results" }), 500);
        }
        return next;
      });
    }, 220);
    return () => clearInterval(id);
  }, [navigate]);

  const size = 240;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;

  return (
    <div className="flex flex-1 flex-col">
      <AppBar
        leading={
          <IconButton label="Cancel" onClick={() => navigate({ to: "/home" })}>
            <Symbol name="close" />
          </IconButton>
        }
        title="Scanning storage"
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--color-ring-track)"
              strokeWidth={stroke}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--color-ring-fill)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 220ms linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Symbol name="radar" filled className="text-primary" size={36} />
            <span className="mt-2 text-5xl font-normal tabular-nums text-on-surface">
              {Math.round(progress)}
            </span>
            <span className="text-[13px] text-on-surface-variant">percent complete</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[16px] font-medium text-on-surface">{stages[stage]}</p>
          <p className="mt-1 text-[12px] text-on-surface-variant">
            Analysing on your device. Nothing is uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
