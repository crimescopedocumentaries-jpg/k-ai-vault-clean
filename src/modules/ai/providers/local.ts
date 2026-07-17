/**
 * LocalAIProvider — heuristic on-device provider. Always available.
 * Replaceable with a TFLite/NNAPI/MediaPipe bridge on native builds.
 */

import type { AIProvider, AIRequest, AIResponse } from "../router";

export const localAIProvider: AIProvider = {
  id: "local.heuristics.v1",
  kind: "local",
  available: () => true,
  async run(req: AIRequest): Promise<AIResponse> {
    switch (req.kind) {
      case "recommendation":
        return {
          text: "Review large videos to recover the most space.",
          confidence: 0.6,
          source: "local",
        };
      case "insight":
        return {
          text: "Videos are consuming most of your storage.",
          confidence: 0.55,
          source: "local",
        };
      case "explanation":
        return {
          text: "Compression reduces file size while keeping originals in Safe Vault.",
          confidence: 0.7,
          source: "local",
        };
      case "classification":
        return { text: "unknown", confidence: 0.4, source: "local" };
    }
  },
};
