/**
 * CleanupService.
 * Offline: junk, cache, empty folders, temp files.
 * Online: AI usage-based suggestions.
 */

import { AIService } from "../ai/service";
import { connectivity } from "../core/connectivity";

export interface CleanupItem {
  path: string;
  bytes: number;
  reason: "cache" | "temp" | "empty" | "junk";
}

export interface CleanupProvider {
  scan(): Promise<CleanupItem[]>;
  remove(paths: string[]): Promise<number>; // bytes freed
}

const defaultProvider: CleanupProvider = {
  async scan() {
    return [];
  },
  async remove() {
    return 0;
  },
};

let provider: CleanupProvider = defaultProvider;

export const CleanupService = {
  setProvider(p: CleanupProvider) {
    provider = p;
  },
  async scan(): Promise<{ items: CleanupItem[]; suggestion?: string }> {
    const items = await provider.scan();
    if (!connectivity.isOnline) return { items };
    const ai = await AIService.ask({
      kind: "recommendation",
      prompt: "Cleanup suggestion",
      context: { count: items.length },
    });
    return { items, suggestion: ai.text };
  },
  remove: (paths: string[]) => provider.remove(paths),
};
