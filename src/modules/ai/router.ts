/**
 * AIRouter — the UI never knows which provider answered.
 * If offline → LocalAIProvider. If online → CloudAIProvider.
 * Providers are replaceable; add new ones without touching the UI.
 */

import { connectivity } from "../core/connectivity";

export interface AIRequest {
  kind: "recommendation" | "insight" | "explanation" | "classification";
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AIResponse {
  text: string;
  confidence: number; // 0..1
  source: "local" | "cloud";
}

export interface AIProvider {
  readonly id: string;
  readonly kind: "local" | "cloud";
  available(): boolean | Promise<boolean>;
  run(req: AIRequest): Promise<AIResponse>;
}

class AIRouter {
  private local?: AIProvider;
  private cloud?: AIProvider;

  registerLocal(p: AIProvider) {
    this.local = p;
  }
  registerCloud(p: AIProvider) {
    this.cloud = p;
  }

  async run(req: AIRequest): Promise<AIResponse> {
    if (connectivity.isOnline && this.cloud && (await this.cloud.available())) {
      try {
        return await this.cloud.run(req);
      } catch {
        /* fall back to local */
      }
    }
    if (this.local && (await this.local.available())) {
      return this.local.run(req);
    }
    return {
      text: "AI assistance unavailable.",
      confidence: 0,
      source: "local",
    };
  }
}

export const aiRouter = new AIRouter();
