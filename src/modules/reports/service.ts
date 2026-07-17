/**
 * ReportsService.
 * Offline: local history (storage, compression).
 * Online: sync history + multi-device reports.
 */

import { RepositoryCoordinator } from "../core/repository";
import { LocalStoreRepository } from "../core/local-store";

export interface ReportEntry {
  id: string;
  kind: "scan" | "compression" | "cleanup" | "vault";
  at: number;
  summary: string;
  bytesAffected: number;
}

const repo = new RepositoryCoordinator<ReportEntry>({
  name: "reports",
  local: new LocalStoreRepository<ReportEntry>("reports"),
});

export const ReportsService = {
  async record(entry: Omit<ReportEntry, "id" | "at">): Promise<ReportEntry> {
    const full: ReportEntry = {
      ...entry,
      id: crypto.randomUUID(),
      at: Date.now(),
    };
    await repo.put(full.id, full);
    return full;
  },
  list: () => repo.list(),
};
