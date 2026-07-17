/**
 * DuplicatesService.
 * Offline: hash comparison, exact duplicates, similar filenames.
 * Online: AI similarity for near-duplicate photos/documents.
 */

import { AIService } from "../ai/service";
import { connectivity } from "../core/connectivity";

export interface DuplicateGroup {
  key: string;
  bytesPerItem: number;
  paths: string[];
  kind: "exact" | "similar-name" | "ai-similar";
}

export interface DuplicatesProvider {
  findExact(): Promise<DuplicateGroup[]>;
  findSimilarNames(): Promise<DuplicateGroup[]>;
}

const defaultProvider: DuplicatesProvider = {
  async findExact() {
    return [];
  },
  async findSimilarNames() {
    return [];
  },
};

let provider: DuplicatesProvider = defaultProvider;

export const DuplicatesService = {
  setProvider(p: DuplicatesProvider) {
    provider = p;
  },
  async scan(): Promise<DuplicateGroup[]> {
    const [exact, similar] = await Promise.all([
      provider.findExact(),
      provider.findSimilarNames(),
    ]);
    const base = [...exact, ...similar];
    if (!connectivity.isOnline) return base;
    // Online enhancement — AI near-duplicate augmentation (stub).
    await AIService.ask({ kind: "classification", prompt: "near-duplicate" });
    return base;
  },
};
