/**
 * Domain history stores — scan, compression, cleanup. Each is offline-first
 * (LocalStoreRepository) and gains cross-device sync when a CloudRepository
 * is attached at bootstrap. Consumed by ReportsService and by native
 * providers that emit run receipts.
 */

import { RepositoryCoordinator, type CloudRepository } from "../core/repository";
import { LocalStoreRepository } from "../core/local-store";

export interface HistoryEntry {
  id: string;
  at: number;
  summary: string;
  bytesAffected: number;
  meta?: Record<string, unknown>;
}

type Kind = "scan" | "compression" | "cleanup";

const clouds: Partial<Record<Kind, CloudRepository<HistoryEntry>>> = {};
const repos: Record<Kind, RepositoryCoordinator<HistoryEntry>> = {
  scan: buildRepo("scan"),
  compression: buildRepo("compression"),
  cleanup: buildRepo("cleanup"),
};

function buildRepo(kind: Kind) {
  return new RepositoryCoordinator<HistoryEntry>({
    name: `${kind}-history`,
    local: new LocalStoreRepository<HistoryEntry>(`${kind}-history`),
    cloud: clouds[kind],
    resolveConflict: (l, c) => (l.at >= c.at ? l : c),
  });
}

export function __attachHistoryClouds(map: {
  scan?: CloudRepository<HistoryEntry>;
  compression?: CloudRepository<HistoryEntry>;
  cleanup?: CloudRepository<HistoryEntry>;
}) {
  (Object.keys(map) as Kind[]).forEach((k) => {
    const c = map[k];
    if (!c) return;
    clouds[k] = c;
    repos[k] = buildRepo(k);
  });
}

export const HistoryService = {
  async record(kind: Kind, entry: Omit<HistoryEntry, "id" | "at">) {
    const full: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      at: Date.now(),
    };
    await repos[kind].put(full.id, full);
    return full;
  },
  list: (kind: Kind) => repos[kind].list(),
};
