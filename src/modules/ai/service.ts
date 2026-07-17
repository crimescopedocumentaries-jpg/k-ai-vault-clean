import { aiRouter, type AIRequest, type AIResponse } from "./router";
import { localAIProvider } from "./providers/local";
import { cloudAIProvider } from "./providers/cloud";

aiRouter.registerLocal(localAIProvider);
aiRouter.registerCloud(cloudAIProvider);

/** Single AIService facade. UI/services only talk to this. */
export const AIService = {
  ask(req: AIRequest): Promise<AIResponse> {
    return aiRouter.run(req);
  },
};
