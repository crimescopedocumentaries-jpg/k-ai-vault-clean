/**
 * StorageService — Application Service facade for the Storage module.
 * Offline: full device scan, breakdown, largest items, cache/empty folders.
 * Online enhancement: AI insights, predictive trends, personalized recs.
 * UI never talks to providers directly.
 */

import { AIService } from "../ai/service";
import { connectivity } from "../core/connectivity";

export interface StorageBreakdown {
  photos: number;
  videos: number;
  audio: number;
  documents: number;
  apps: number;
  other: number;
}

export interface StorageReport {
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  recoverableBytes: number;
  healthScore: number;
  breakdown: StorageBreakdown;
  insight?: string; // present only when AI enhancement succeeded
}

export interface StorageProvider {
  scan(): Promise<Omit<StorageReport, "insight">>;
}

/** Default provider stub. Replace on native with a Capacitor plugin. */
const defaultProvider: StorageProvider = {
  async scan() {
    return {
      totalBytes: 128 * 1024 ** 3,
      usedBytes: 92 * 1024 ** 3,
      freeBytes: 36 * 1024 ** 3,
      recoverableBytes: 8.4 * 1024 ** 3,
      healthScore: 72,
      breakdown: {
        photos: 22 * 1024 ** 3,
        videos: 40 * 1024 ** 3,
        audio: 4 * 1024 ** 3,
        documents: 3 * 1024 ** 3,
        apps: 15 * 1024 ** 3,
        other: 8 * 1024 ** 3,
      },
    };
  },
};

let provider: StorageProvider = defaultProvider;

export const StorageService = {
  setProvider(p: StorageProvider) {
    provider = p;
  },
  async scan(): Promise<StorageReport> {
    const base = await provider.scan();
    if (!connectivity.isOnline) return base;
    try {
      const ai = await AIService.ask({
        kind: "insight",
        prompt: "Summarize storage health",
        context: base,
      });
      return { ...base, insight: ai.text };
    } catch {
      return base;
    }
  },
};
