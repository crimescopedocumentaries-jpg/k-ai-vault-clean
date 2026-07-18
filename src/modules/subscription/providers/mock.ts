/**
 * MockSubscriptionProvider — V1 provider. Persists entitlement locally so
 * Premium can be exercised end-to-end without a billing SDK. Replaced by
 * Play Billing / RevenueCat / Stripe providers without UI changes.
 */

import type {
  Entitlement,
  Plan,
  PlanId,
  PurchaseResult,
  SubscriptionProvider,
} from "../types";
import type { FeatureKey } from "../types";

const STORAGE_KEY = "kai.subscription.v1";

const ALL_PREMIUM: FeatureKey[] = [
  "deep_scan",
  "ai_expert",
  "smart_cleanup",
  "weekly_scan",
  "timeline",
  "forecast",
  "advanced_duplicates",
  "encrypted_backup",
];

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceLabel: "Free forever",
    period: "free",
    features: [],
    tagline: "Everything you already use — no limits added.",
  },
  {
    id: "premium_monthly",
    name: "Premium Monthly",
    priceLabel: "$2.99 / month",
    period: "month",
    features: ALL_PREMIUM,
    tagline: "All Premium features. Cancel anytime.",
  },
  {
    id: "premium_yearly",
    name: "Premium Yearly",
    priceLabel: "$19.99 / year",
    period: "year",
    features: ALL_PREMIUM,
    highlight: true,
    tagline: "Best value — save 44%.",
  },
  {
    id: "premium_lifetime",
    name: "Lifetime",
    priceLabel: "$49.99 once",
    period: "lifetime",
    features: ALL_PREMIUM,
    tagline: "Pay once. Yours forever.",
  },
];

function loadEntitlement(): Entitlement {
  if (typeof window === "undefined") {
    return { planId: "free", active: true, source: "mock" };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { planId: "free", active: true, source: "mock" };
    const parsed = JSON.parse(raw) as Entitlement;
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      return { planId: "free", active: true, source: "mock" };
    }
    return parsed;
  } catch {
    return { planId: "free", active: true, source: "mock" };
  }
}

function saveEntitlement(e: Entitlement) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(e));
}

function entitlementFor(planId: PlanId): Entitlement {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  switch (planId) {
    case "premium_monthly":
      return { planId, active: true, expiresAt: now + 30 * day, source: "mock" };
    case "premium_yearly":
      return { planId, active: true, expiresAt: now + 365 * day, source: "mock" };
    case "premium_lifetime":
      return { planId, active: true, source: "mock" };
    default:
      return { planId: "free", active: true, source: "mock" };
  }
}

export const mockSubscriptionProvider: SubscriptionProvider = {
  id: "mock.v1",
  async listPlans() {
    return PLANS;
  },
  async getEntitlement() {
    return loadEntitlement();
  },
  async purchase(planId: PlanId): Promise<PurchaseResult> {
    const ent = entitlementFor(planId);
    saveEntitlement(ent);
    return { ok: true, entitlement: ent };
  },
  async restore(): Promise<PurchaseResult> {
    const ent = loadEntitlement();
    return { ok: true, entitlement: ent };
  },
};
