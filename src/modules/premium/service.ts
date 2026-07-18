/**
 * PremiumService — single source of truth for entitlement + feature checks.
 * Sits above SubscriptionService so the UI never talks to a billing
 * provider directly. Observable via subscribe().
 */

import { SubscriptionService } from "../subscription/service";
import type { Entitlement, FeatureKey } from "../subscription/types";
import { FEATURES } from "./features";

let current: Entitlement = { planId: "free", active: true, source: "mock" };
const listeners = new Set<(e: Entitlement) => void>();
let initialized = false;

function planFeatures(): FeatureKey[] {
  if (current.planId === "free" || !current.active) return [];
  // All paid plans unlock every feature in V1.
  return FEATURES.map((f) => f.key);
}

async function refresh() {
  current = await SubscriptionService.getEntitlement();
  listeners.forEach((fn) => fn(current));
}

export const PremiumService = {
  async init() {
    if (initialized) return;
    initialized = true;
    await refresh();
    SubscriptionService.subscribe((e) => {
      current = e;
      listeners.forEach((fn) => fn(current));
    });
  },
  getEntitlement(): Entitlement {
    return current;
  },
  isPremium(): boolean {
    return current.active && current.planId !== "free";
  },
  hasFeature(key: FeatureKey): boolean {
    return planFeatures().includes(key);
  },
  subscribe(listener: (e: Entitlement) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  refresh,
};
