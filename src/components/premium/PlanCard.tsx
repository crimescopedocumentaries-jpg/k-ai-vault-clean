import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { Symbol } from "@/components/IconButton";
import type { Plan } from "@/modules/subscription/types";

type Props = {
  plan: Plan;
  current: boolean;
  loading?: boolean;
  onSelect: () => void;
};

export function PlanCard({ plan, current, loading, onSelect }: Props) {
  return (
    <Card
      className={
        "flex flex-col gap-3 " +
        (plan.highlight ? "border border-primary" : "")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-medium text-on-surface">{plan.name}</p>
          <p className="mt-0.5 text-[13px] text-on-surface-variant">
            {plan.priceLabel}
          </p>
        </div>
        {plan.highlight && (
          <span className="rounded-full bg-primary-container px-2.5 py-1 text-[11px] font-medium text-on-primary-container">
            Best value
          </span>
        )}
      </div>
      {plan.tagline && (
        <p className="text-[12px] leading-relaxed text-on-surface-variant">
          {plan.tagline}
        </p>
      )}
      <MButton
        variant={current ? "outlined" : plan.highlight ? "filled" : "tonal"}
        full
        onClick={onSelect}
        disabled={loading || current}
      >
        {current ? (
          <span className="inline-flex items-center gap-1.5">
            <Symbol name="check" size={18} /> Current plan
          </span>
        ) : plan.id === "free" ? (
          "Continue with Free"
        ) : (
          `Choose ${plan.name}`
        )}
      </MButton>
    </Card>
  );
}
