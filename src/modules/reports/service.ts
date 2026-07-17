/**
 * ReportsService.
 * Offline: local report history.
 * Online: sync history + multi-device reports via CloudKvRepository.
 */

import { RepositoryCoordinator, type CloudRepository } from "../core/repository";
import { LocalStoreRepository } from "../core/local-store";

export interface ReportEntry {
  id: string;
  kind: "scan" | "compression" | "cleanup" | "vault";
  at: number;
  summary: string;
  bytesAffected: number;
}

let cloud: CloudRepository<ReportEntry> | undefined;
let repo = build();

function build() {
  return new RepositoryCoordinator<ReportEntry>({
    name: "reports",
    local: new LocalStoreRepository<ReportEntry>("reports"),
    cloud,
    resolveConflict: (l, c) => (l.at >= c.at ? l : c),
  });
}

export function __attachReportsCloud(c: CloudRepository<ReportEntry>) {
  cloud = c;
  repo = build();
}

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
