/**
 * CompressionService.
 * Offline: image/video/audio/PDF/ZIP compression (native plugin).
 * Online: AI codec + quality prediction.
 */

import { AIService } from "../ai/service";
import { connectivity } from "../core/connectivity";

export type CompressionMode = "high-quality" | "balanced" | "max-savings";

export interface CompressionEstimate {
  savingsBytes: number;
  expectedQuality: number; // 0..1
  durationMs: number;
  confidence: number;
  recommendation?: CompressionMode;
}

export interface CompressionProvider {
  estimate(paths: string[], mode: CompressionMode): Promise<CompressionEstimate>;
  compress(
    paths: string[],
    mode: CompressionMode,
    onProgress?: (p: number) => void,
  ): Promise<{ savingsBytes: number; outputPaths: string[] }>;
}

const defaultProvider: CompressionProvider = {
  async estimate() {
    return {
      savingsBytes: 0,
      expectedQuality: 0.9,
      durationMs: 0,
      confidence: 0.5,
    };
  },
  async compress() {
    return { savingsBytes: 0, outputPaths: [] };
  },
};

let provider: CompressionProvider = defaultProvider;

export const CompressionService = {
  setProvider(p: CompressionProvider) {
    provider = p;
  },
  async estimate(
    paths: string[],
    mode: CompressionMode,
  ): Promise<CompressionEstimate> {
    const base = await provider.estimate(paths, mode);
    if (!connectivity.isOnline) return base;
    const ai = await AIService.ask({
      kind: "recommendation",
      prompt: "Best compression mode for these files",
      context: { count: paths.length, mode },
    });
    return {
      ...base,
      recommendation: (ai.text.includes("high")
        ? "high-quality"
        : ai.text.includes("max")
          ? "max-savings"
          : "balanced") as CompressionMode,
    };
  },
  compress: (
    paths: string[],
    mode: CompressionMode,
    onProgress?: (p: number) => void,
  ) => provider.compress(paths, mode, onProgress),
};
