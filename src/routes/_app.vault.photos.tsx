import { createFileRoute } from "@tanstack/react-router";
import { VaultDetail } from "@/components/VaultDetail";
import { previewProtectedPhotos } from "@/services/previewData";

export const Route = createFileRoute("/_app/vault/photos")({
  component: () => (
    <VaultDetail
      title="Protected Photos"
      subtitleUnit="Photos"
      items={previewProtectedPhotos}
      emptyTitle="No Protected Photos Yet"
      emptyBody="Your original photos will appear here after compression."
      emptyCta={{ label: "Compress Photos", to: "/scan" }}
    />
  ),
});
