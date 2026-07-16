import { createFileRoute } from "@tanstack/react-router";
import { VaultDetail } from "@/components/VaultDetail";
import { previewProtectedVideos } from "@/services/previewData";

export const Route = createFileRoute("/_app/vault/videos")({
  component: () => (
    <VaultDetail
      title="Protected Videos"
      subtitleUnit="Videos"
      items={previewProtectedVideos}
      emptyTitle="No Protected Videos Yet"
      emptyBody="Your original videos will appear here after compression."
      emptyCta={{ label: "Compress Videos", to: "/scan" }}
    />
  ),
});
