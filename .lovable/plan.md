# K-Ai Storage Saver — Commercial Evolution Plan (V1 Monetization)

Non-destructive evolution. No rewrite, no redesign, no removed features. All existing UI, routing, services, and the Engineering Constitution remain intact. Every change is additive and layered behind the existing Application Service Layer.

## 1. Product Evolution Summary

Turn the app into the smartest Android storage assistant while preserving a genuinely useful Free tier. Premium unlocks depth (deep scan, forecasting, timeline, one-tap cleanup, advanced duplicates, encrypted cloud backup) — never gates core value. Paywall appears contextually *after* value is demonstrated.

## 2. Updated Feature Map

**Free (unchanged + minor enhancements)**
- Storage Scan, Health, Reports, Cleanup Suggestions, Safe Cleanup, Vault, Compression, Basic AI recs, Dashboard, Offline mode.

**Premium (new, additive)**
| # | Feature | Backing Service |
|---|---|---|
| 1 | Smart Deep Storage Scan | `StorageInsightsService` |
| 2 | AI Storage Expert (narrative recs) | `AIService` (new `expert` kind) |
| 3 | One-Tap Smart Cleanup | `CleanupService.runSmartPlan()` |
| 4 | Automatic Weekly Scan | `ScheduleService` + `NotificationsService` |
| 5 | Storage Growth Timeline | `TimelineService` |
| 6 | Personal Storage Coach (forecast) | `ForecastService` |
| 7 | Advanced Duplicate Intelligence | `DuplicatesService` (premium provider tier) |
| 8 | Encrypted Cloud Backup | `SyncService` (encrypted profile) |

## 3. Premium Architecture

```
UI (unchanged routes)
   │
   ├── usePremium() hook  ─────► PremiumService ─► SubscriptionService ─► SubscriptionProvider
   │                                                                        (mock | play | revenuecat | stripe)
   ▼
Application Services (existing + new)
   │
   ▼
RepositoryCoordinator ─► Providers (browser | android | cloud)
```

- `SubscriptionService` is a provider-agnostic abstraction. Zero hardcoded billing SDK.
- `PremiumService` = single source of truth for entitlement checks (`isPremium`, `hasFeature(key)`).
- Feature gates are declarative: `<PremiumGate feature="deep_scan">…</PremiumGate>` renders inline value-first upsell rather than blocking UI.
- No paywall modals interrupt existing flows. Upsell surfaces only when: (a) user taps a premium action, (b) AI detects large recoverable space, (c) user opens advanced tabs.

## 4. New Application Services (all under `src/modules/`)

| Service | Responsibility | Provider(s) |
|---|---|---|
| `SubscriptionService` | Fetch plans, current entitlement, purchase, restore | `MockSubscriptionProvider` (V1), later Play/RevenueCat/Stripe |
| `PremiumService` | Entitlement + feature-flag resolver over Subscription | — |
| `StorageInsightsService` | Deep scan, forgotten media, oversized/rarely-accessed, APK detection | Browser + Android provider |
| `TimelineService` | Persist storage snapshots over time; expose series | Repo-backed |
| `ForecastService` | Predict fill date, growing folders, trend labels | Local heuristic + optional AI |
| `ScheduleService` | Weekly scan scheduler + trigger dispatch | Browser (interval) / Android (WorkManager) |

All new services follow: UI → Service → RepositoryCoordinator → Provider. No UI reads Supabase, providers, or repos directly.

## 5. New Data Models (additive)

```ts
// modules/subscription/types.ts
type PlanId = "free" | "premium_monthly" | "premium_yearly" | "premium_lifetime";
interface Plan { id: PlanId; priceLabel: string; period: "month"|"year"|"lifetime"|"free"; features: FeatureKey[] }
interface Entitlement { planId: PlanId; active: boolean; expiresAt?: number; source: "mock"|"play"|"revenuecat"|"stripe" }
type FeatureKey =
  | "deep_scan" | "ai_expert" | "smart_cleanup" | "weekly_scan"
  | "timeline" | "forecast" | "advanced_duplicates" | "encrypted_backup";

// modules/timeline/types.ts
interface StorageSnapshotPoint { at: number; usedBytes: number; totalBytes: number; breakdown: Record<Category, number> }

// modules/forecast/types.ts
interface StorageForecast { fillDateEstimate?: number; dailyGrowthBytes: number; topGrowingFolders: {path:string; deltaBytes:number}[]; confidence: number }

// modules/insights/types.ts
interface DeepFinding { kind:"forgotten_video"|"old_download"|"duplicate"|"screenshot_burst"|"apk"|"oversized"|"rarely_accessed"; bytes:number; count:number; sample:string[]; recoverableBytes:number }
```

Persistence: reuse `RepositoryCoordinator` / `LocalStoreRepository` (offline) with optional `CloudKvRepository` mirror for Premium encrypted backup. No schema changes required for V1 (all key-value); a Supabase table is only added when encrypted backup ships.

## 6. Migration Impact

- **Zero breaking changes.** All new services are additive exports from `src/modules/index.ts`.
- Existing screens keep working with no code change. Premium surfaces are opt-in additions inside existing routes (Dashboard tile, Vault footer, Duplicates panel, new Insights tab in Reports).
- `bootstrap.ts` gains provider registration for new services (Mock subscription + browser providers).
- No route renames, no nav restructure. New routes are additive only where required (see §7).
- Engineering Constitution honored: UI ↔ Services only; providers hidden; offline-first preserved.

## 7. Files to Modify / Add

**New (additive):**
```
src/modules/subscription/{service.ts, types.ts, providers/mock.ts}
src/modules/premium/{service.ts, features.ts}
src/modules/insights/{service.ts, types.ts, providers/browser.ts}
src/modules/timeline/{service.ts, types.ts, providers/browser.ts}
src/modules/forecast/{service.ts, types.ts, providers/browser.ts}
src/modules/schedule/{service.ts, providers/browser.ts}
src/components/premium/{PremiumGate.tsx, UpsellInline.tsx, PlanCard.tsx}
src/hooks/usePremium.ts
src/routes/premium.tsx                 // plans + restore (new route, not gated)
src/routes/_app.insights.tsx           // Storage Intelligence tab (Free sees basics, Premium sees full)
```

**Modified (surgical, additive only):**
```
src/modules/index.ts                   // export new services
src/modules/bootstrap.ts               // register new browser providers
src/routes/__root.tsx                  // mount PremiumProvider context
src/routes/_app.home.tsx               // add "Premium suggestion" card when AI detects big recovery
src/routes/_app.settings.tsx           // add "Subscription" row → /premium
src/routes/_app.vault.index.tsx        // add encrypted-backup badge (gated)
src/routes/compress.index.tsx          // show "Auto compression" premium hint (inline, non-blocking)
src/components/BottomNav.tsx           // add "Insights" entry (Free-accessible)
ENGINEERING_CONSTITUTION.md            // Amendment A2: Monetization & Feature Gating governance
```

No changes to: existing service contracts, `AIRouter`, `RepositoryCoordinator`, Supabase client files, auto-generated files.

## 8. Implementation Roadmap (approval-gated milestones)

- **M4.1 — Subscription foundation.** `SubscriptionService`, `PremiumService`, `MockSubscriptionProvider`, `usePremium`, `/premium` route, Settings entry. No gating yet.
- **M4.2 — Feature gating primitives.** `PremiumGate`, `UpsellInline`, feature-key registry, contextual upsell logic (value-first triggers).
- **M4.3 — StorageInsightsService + Deep Scan.** Browser provider heuristics; Free sees summary, Premium sees full finding list.
- **M4.4 — TimelineService + Insights route.** Persist snapshots, render growth chart, AI narration for growth reasons.
- **M4.5 — ForecastService (Personal Coach).** Fill-date prediction, growing folders, coach card on Dashboard.
- **M4.6 — One-Tap Smart Cleanup.** `CleanupService.runSmartPlan()` orchestrating existing cleanup + compression steps.
- **M4.7 — Advanced Duplicate Intelligence.** Extend `DuplicatesService` with premium-tier provider (perceptual hash, burst grouping).
- **M4.8 — ScheduleService + Weekly Scan notifications.** Value-only notifications via `NotificationsService`.
- **M4.9 — Encrypted Cloud Backup.** Extend `SyncService`; client-side AES-GCM; opt-in.
- **M4.10 — Constitution Amendment A2** + Architecture Compliance Report update.

Each milestone: independently commit-able, ships behind `PremiumService` where relevant, keeps Free experience unchanged, and includes a compliance check that UI never bypasses the Service Layer.

---

Awaiting approval to begin **Milestone 4.1**.
