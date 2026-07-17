/**
 * SettingsService.
 * Offline: full local prefs.
 * Online: optional cross-device sync via RepositoryCoordinator.
 * The existing SettingsProvider (src/lib/settings.tsx) remains the UI-facing
 * hook; this service is the persistence contract behind it.
 */

import { RepositoryCoordinator } from "../core/repository";
import { LocalStoreRepository } from "../core/local-store";

export interface SettingsRecord {
  id: "app";
  data: Record<string, unknown>;
  updatedAt: number;
}

const repo = new RepositoryCoordinator<SettingsRecord>({
  name: "settings",
  local: new LocalStoreRepository<SettingsRecord>("settings"),
  resolveConflict: (l, c) => (l.updatedAt >= c.updatedAt ? l : c),
});

export const SettingsService = {
  async load(): Promise<Record<string, unknown> | null> {
    const rec = await repo.get("app");
    return rec?.data ?? null;
  },
  async save(data: Record<string, unknown>): Promise<void> {
    await repo.put("app", { id: "app", data, updatedAt: Date.now() });
  },
};
