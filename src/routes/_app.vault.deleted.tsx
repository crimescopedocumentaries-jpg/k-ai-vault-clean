import { createFileRoute } from "@tanstack/react-router";
import { VaultDetail } from "@/components/VaultDetail";
import { previewDeletedItems } from "@/services/previewData";

export const Route = createFileRoute("/_app/vault/deleted")({
  component: () => (
    <VaultDetail
      title="Deleted Through K-Ai"
      subtitleUnit="Items"
      items={previewDeletedItems}
      showDeletedMeta
      emptyTitle="Nothing Deleted"
      emptyBody="Items you delete through K-Ai stay recoverable here until retention ends."
    />
  ),
});
