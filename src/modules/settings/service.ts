/**
 * SettingsService.
 * Offline: full local prefs.
 * Online: cross-device sync via RepositoryCoordinator + CloudKvRepository.
 * The existing SettingsProvider (src/lib/settings.tsx) remains the UI-facing
 * hook; this service is the persistence contract behind it.
 */

import { RepositoryCoordinator, type CloudRepository } from "../core/repository";
import { LocalStoreRepository } from "../core/local-store";

export interface SettingsRecord {
  id: "app";
  data: Record<string, unknown>;
  updatedAt: number;
}

let cloud: CloudRepository<SettingsRecord> | undefined;
let repo = build();

function build() {
  return new RepositoryCoordinator<SettingsRecord>({
    name: "settings",
    local: new LocalStoreRepository<SettingsRecord>("settings"),
    cloud,
    resolveConflict: (l, c) => (l.updatedAt >= c.updatedAt ? l : c),
  });
}

/** Internal seam used by bootstrap to attach the production cloud repo. */
export function __attachSettingsCloud(c: CloudRepository<SettingsRecord>) {
  cloud = c;
  repo = build();
}

export const SettingsService = {
  async load(): Promise<Record<string, unknown> | null> {
    const rec = await repo.get("app");
    return rec?.data ?? null;
  },
  async save(data: Record<string, unknown>): Promise<void> {
    await repo.put("app", { id: "app", data, updatedAt: Date.now() });
  },
};
