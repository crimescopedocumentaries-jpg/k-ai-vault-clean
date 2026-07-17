/**
 * Server-side AI Gateway bridge. UI never talks to a model directly;
 * CloudAIProvider calls this server function which owns LOVABLE_API_KEY.
 *
 * Provider-agnostic by design: swapping to OpenAI, Gemini, Claude, DeepSeek,
 * or a local LLM only requires editing this handler — the UI, AIService,
 * and AIRouter stay unchanged.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AiKind = z.enum([
  "recommendation",
  "insight",
  "explanation",
  "classification",
]);

const AiInput = z.object({
  kind: AiKind,
  prompt: z.string().min(1).max(4000),
  context: z.record(z.string(), z.unknown()).optional(),
  model: z.string().optional(),
});

const SYSTEM_BY_KIND: Record<z.infer<typeof AiKind>, string> = {
  recommendation:
    "You are K-Ai, a privacy-first Android storage assistant. Give one concise, actionable recommendation (max 2 sentences). Never invent numbers.",
  insight:
    "You are K-Ai. Summarize the user's storage state in one clear sentence for a dashboard card.",
  explanation:
    "You are K-Ai. Explain the concept briefly for a non-technical user (max 2 sentences).",
  classification:
    "You are K-Ai. Reply with a single lowercase label only, no punctuation.",
};

export const askAi = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => AiInput.parse(raw))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        text: "AI cloud unavailable.",
        confidence: 0,
        source: "cloud" as const,
        degraded: true,
      };
    }

    const model = data.model ?? "google/gemini-2.5-flash";
    const system = SYSTEM_BY_KIND[data.kind];
    const userContent =
      data.context && Object.keys(data.context).length > 0
        ? `${data.prompt}\n\nContext (JSON):\n${JSON.stringify(data.context)}`
        : data.prompt;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": apiKey,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: userContent },
          ],
        }),
      });

      if (res.status === 429) {
        return {
          text: "AI is busy. Try again shortly.",
          confidence: 0,
          source: "cloud" as const,
          degraded: true,
        };
      }
      if (res.status === 402) {
        return {
          text: "AI credits exhausted.",
          confidence: 0,
          source: "cloud" as const,
          degraded: true,
        };
      }
      if (!res.ok) {
        return {
          text: "AI unavailable.",
          confidence: 0,
          source: "cloud" as const,
          degraded: true,
        };
      }

      const payload = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = payload.choices?.[0]?.message?.content?.trim() ?? "";
      return {
        text: text || "No suggestion.",
        confidence: text ? 0.9 : 0.3,
        source: "cloud" as const,
        degraded: false,
      };
    } catch {
      return {
        text: "AI unavailable.",
        confidence: 0,
        source: "cloud" as const,
        degraded: true,
      };
    }
  });
