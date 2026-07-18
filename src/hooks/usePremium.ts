import { useEffect, useState } from "react";
import { PremiumService } from "@/modules/premium/service";
import type { Entitlement, FeatureKey } from "@/modules/subscription/types";

export function usePremium() {
  const [entitlement, setEntitlement] = useState<Entitlement>(
    PremiumService.getEntitlement(),
  );

  useEffect(() => {
    let mounted = true;
    PremiumService.init().then(() => {
      if (mounted) setEntitlement(PremiumService.getEntitlement());
    });
    const unsub = PremiumService.subscribe((e) => {
      if (mounted) setEntitlement(e);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  return {
    entitlement,
    isPremium: entitlement.active && entitlement.planId !== "free",
    hasFeature: (key: FeatureKey) =>
      entitlement.active &&
      entitlement.planId !== "free",
  };
}
