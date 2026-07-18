/**
 * SubscriptionService — the single facade the UI/PremiumService talks to.
 * Swapping billing providers happens here; UI is unchanged.
 */

import type {
  Entitlement,
  Plan,
  PlanId,
  PurchaseResult,
  SubscriptionProvider,
} from "./types";

const defaultProvider: SubscriptionProvider = {
  id: "noop",
  async listPlans() {
    return [];
  },
  async getEntitlement() {
    return { planId: "free", active: true, source: "mock" };
  },
  async purchase() {
    return { ok: false, reason: "No subscription provider registered." };
  },
  async restore() {
    return { ok: false, reason: "No subscription provider registered." };
  },
};

let provider: SubscriptionProvider = defaultProvider;
const listeners = new Set<(e: Entitlement) => void>();

export const SubscriptionService = {
  setProvider(p: SubscriptionProvider) {
    provider = p;
  },
  listPlans(): Promise<Plan[]> {
    return provider.listPlans();
  },
  getEntitlement(): Promise<Entitlement> {
    return provider.getEntitlement();
  },
  async purchase(planId: PlanId): Promise<PurchaseResult> {
    const result = await provider.purchase(planId);
    if (result.ok && result.entitlement) {
      listeners.forEach((fn) => fn(result.entitlement!));
    }
    return result;
  },
  async restore(): Promise<PurchaseResult> {
    const result = await provider.restore();
    if (result.ok && result.entitlement) {
      listeners.forEach((fn) => fn(result.entitlement!));
    }
    return result;
  },
  subscribe(listener: (e: Entitlement) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
