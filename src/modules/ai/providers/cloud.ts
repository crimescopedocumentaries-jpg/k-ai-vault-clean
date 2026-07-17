/**
 * CloudAIProvider — production provider that calls the Lovable AI Gateway
 * through a server function. Keys never enter the client bundle.
 *
 * Swap the underlying model/provider (OpenAI, Gemini, Claude, DeepSeek,
 * self-hosted LLM) inside `src/lib/ai.functions.ts` without touching the UI,
 * AIService, or AIRouter.
 */

import type { AIProvider, AIRequest, AIResponse } from "../router";
import { connectivity } from "../../core/connectivity";
import { askAi } from "@/lib/ai.functions";

export const cloudAIProvider: AIProvider = {
  id: "cloud.gateway.v1",
  kind: "cloud",
  available: () => connectivity.isOnline,
  async run(req: AIRequest): Promise<AIResponse> {
    const result = await askAi({
      data: {
        kind: req.kind,
        prompt: req.prompt,
        context: req.context,
      },
    });
    return {
      text: result.text,
      confidence: result.confidence,
      source: "cloud",
    };
  },
};
