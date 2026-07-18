import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { IconButton, Symbol } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { PlanCard } from "@/components/premium/PlanCard";
import { SubscriptionService } from "@/modules/subscription/service";
import { PremiumService } from "@/modules/premium/service";
import { FEATURES } from "@/modules/premium/features";
import type { Plan, PlanId } from "@/modules/subscription/types";
import { usePremium } from "@/hooks/usePremium";

export const Route = createFileRoute("/premium")({
  component: PremiumScreen,
  head: () => ({
    meta: [
      { title: "K-Ai Premium — Unlock deep scan, forecasts and smart cleanup" },
      {
        name: "description",
        content:
          "Upgrade to K-Ai Premium for Smart Deep Scan, AI Storage Expert, One-Tap Cleanup, Storage Timeline, Personal Coach and encrypted backup.",
      },
    ],
  }),
});

function PremiumScreen() {
  const navigate = useNavigate();
  const { entitlement } = usePremium();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [busy, setBusy] = useState<PlanId | "restore" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    SubscriptionService.listPlans().then(setPlans);
    PremiumService.init();
  }, []);

  async function choose(planId: PlanId) {
    setBusy(planId);
    setMessage(null);
    const result = await SubscriptionService.purchase(planId);
    setBusy(null);
    if (result.ok) {
      await PremiumService.refresh();
      setMessage(
        planId === "free"
          ? "You're on the Free plan."
          : "Premium unlocked. Enjoy every feature.",
      );
    } else {
      setMessage(result.reason ?? "Could not complete purchase.");
    }
  }

  async function restore() {
    setBusy("restore");
    setMessage(null);
    const result = await SubscriptionService.restore();
    setBusy(null);
    await PremiumService.refresh();
    setMessage(
      result.entitlement && result.entitlement.planId !== "free"
        ? "Premium restored."
        : "No previous purchase found.",
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppBar
        title="K-Ai Premium"
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/settings" })}>
            <Symbol name="arrow_back" />
          </IconButton>
        }
      />

      <div className="flex flex-col gap-4 px-4 pb-8">
        <Card className="flex gap-3 bg-primary-container">
          <Symbol
            name="workspace_premium"
            filled
            className="mt-0.5 text-on-primary-container"
            size={22}
          />
          <div>
            <p className="text-[14px] font-medium text-on-primary-container">
              Do more with the same phone.
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-on-primary-container/90">
              Free keeps everything you already use. Premium adds the smart
              tools that recover the most space with the least effort.
            </p>
          </div>
        </Card>

        {message && (
          <Card padded={false} className="bg-tertiary-container p-3">
            <p className="text-[12px] text-on-tertiary-container">{message}</p>
          </Card>
        )}

        <div>
          <h2 className="px-2 pb-1.5 text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
            Choose a plan
          </h2>
          <div className="flex flex-col gap-3">
            {plans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                current={entitlement.planId === p.id}
                loading={busy === p.id}
                onSelect={() => choose(p.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="px-2 pb-1.5 text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
            What Premium unlocks
          </h2>
          <Card padded={false} className="divide-y divide-border">
            {FEATURES.map((f) => (
              <div key={f.key} className="flex items-start gap-3 p-4">
                <Symbol
                  name={f.icon}
                  className="mt-0.5 text-primary"
                  size={20}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-on-surface">
                    {f.title}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-on-surface-variant">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <MButton variant="text" full onClick={restore} disabled={busy === "restore"}>
          Restore purchase
        </MButton>

        <p className="px-2 text-center text-[11px] leading-relaxed text-on-surface-variant">
          Billing runs through your app store when Premium ships publicly. No
          real charge is made in this build.
        </p>
      </div>
    </div>
  );
}
