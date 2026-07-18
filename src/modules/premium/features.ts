/**
 * Feature registry — declarative source of truth for what each Premium
 * feature unlocks. UI reads labels/descriptions from here so upsell copy
 * stays consistent.
 */

import type { FeatureKey } from "../subscription/types";

export interface FeatureMeta {
  key: FeatureKey;
  title: string;
  description: string;
  icon: string;
}

export const FEATURES: FeatureMeta[] = [
  {
    key: "deep_scan",
    title: "Smart Deep Storage Scan",
    description:
      "Find forgotten videos, old downloads, abandoned APKs, and oversized files.",
    icon: "travel_explore",
  },
  {
    key: "ai_expert",
    title: "AI Storage Expert",
    description:
      "Get plain-language recommendations on exactly what's safe to remove.",
    icon: "psychology",
  },
  {
    key: "smart_cleanup",
    title: "One-Tap Smart Cleanup",
    description: "Run multiple safe cleanup steps in a single confirmed action.",
    icon: "auto_fix_high",
  },
  {
    key: "weekly_scan",
    title: "Automatic Weekly Scan",
    description:
      "Quiet background scans — you're notified only when it's worth acting on.",
    icon: "event_repeat",
  },
  {
    key: "timeline",
    title: "Storage Growth Timeline",
    description:
      "See how storage has grown month over month, with AI explanations.",
    icon: "timeline",
  },
  {
    key: "forecast",
    title: "Personal Storage Coach",
    description:
      "Predict when your device will fill up and which folders are growing fastest.",
    icon: "insights",
  },
  {
    key: "advanced_duplicates",
    title: "Advanced Duplicate Intelligence",
    description:
      "Detect similar photos, burst shots, and duplicates across media types.",
    icon: "photo_library",
  },
  {
    key: "encrypted_backup",
    title: "Encrypted Cloud Backup",
    description:
      "Sync Vault metadata, reports, and settings — end-to-end encrypted.",
    icon: "cloud_done",
  },
];

export function featureMeta(key: FeatureKey): FeatureMeta {
  return FEATURES.find((f) => f.key === key)!;
}
