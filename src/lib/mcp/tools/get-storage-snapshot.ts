import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import {
  previewSnapshot,
  previewBuckets,
  previewVault,
  previewVaultBytes,
} from "@/services/previewData";

export default defineTool({
  name: "get_storage_snapshot",
  title: "Get storage snapshot",
  description:
    "Return the signed-in K-Ai user's current storage snapshot: total/used/free bytes, health score, recoverable space, per-category breakdown, top storage buckets, and Safe Vault totals.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text", text: "Not authenticated." }],
        isError: true,
      };
    }
    const payload = {
      device: {
        totalBytes: previewSnapshot.totalBytes,
        usedBytes: previewSnapshot.usedBytes,
        freeBytes: previewSnapshot.freeBytes,
        healthScore: previewSnapshot.healthScore,
        recoverableBytes: previewSnapshot.recoverableBytes,
      },
      breakdown: previewSnapshot.breakdown,
      topBuckets: previewBuckets.slice(0, 6).map((b) => ({
        id: b.id,
        label: b.label,
        fileCount: b.fileCount,
        totalBytes: b.totalBytes,
        recoverableBytes: b.recoverableBytes,
      })),
      vault: {
        itemCount: previewVault.itemCount,
        protectedBytes: previewVaultBytes,
        retentionDays: previewVault.retentionDays,
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
