/**
 * Subscription types — provider-agnostic. No billing SDK leaks past this file.
 */

export type PlanId =
  | "free"
  | "premium_monthly"
  | "premium_yearly"
  | "premium_lifetime";

export type FeatureKey =
  | "deep_scan"
  | "ai_expert"
  | "smart_cleanup"
  | "weekly_scan"
  | "timeline"
  | "forecast"
  | "advanced_duplicates"
  | "encrypted_backup";

export type EntitlementSource =
  | "mock"
  | "play"
  | "revenuecat"
  | "stripe";

export interface Plan {
  id: PlanId;
  name: string;
  priceLabel: string;
  period: "month" | "year" | "lifetime" | "free";
  features: FeatureKey[];
  highlight?: boolean;
  tagline?: string;
}

export interface Entitlement {
  planId: PlanId;
  active: boolean;
  expiresAt?: number;
  source: EntitlementSource;
}

export interface PurchaseResult {
  ok: boolean;
  entitlement?: Entitlement;
  reason?: string;
}

export interface SubscriptionProvider {
  readonly id: string;
  listPlans(): Promise<Plan[]>;
  getEntitlement(): Promise<Entitlement>;
  purchase(planId: PlanId): Promise<PurchaseResult>;
  restore(): Promise<PurchaseResult>;
}
