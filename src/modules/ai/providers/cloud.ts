/**
 * CloudAIProvider — Lovable AI Gateway–backed provider.
 * Only invoked by AIRouter when connectivity is online. UI is unaware.
 * The actual gateway call is wired via a server function (createServerFn)
 * so keys never enter the client bundle.
 */

import type { AIProvider, AIRequest, AIResponse } from "../router";
import { connectivity } from "../../core/connectivity";

export const cloudAIProvider: AIProvider = {
  id: "cloud.gateway.v1",
  kind: "cloud",
  available: () => connectivity.isOnline,
  async run(req: AIRequest): Promise<AIResponse> {
    // Placeholder: real call goes through a server function that talks to
    // the Lovable AI Gateway. Kept behind the router so UI never knows.
    return {
      text: `[cloud] ${req.prompt.slice(0, 80)}`,
      confidence: 0.85,
      source: "cloud",
    };
  },
};
