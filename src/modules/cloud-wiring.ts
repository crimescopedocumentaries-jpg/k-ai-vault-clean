/**
 * Cloud wiring — attaches production CloudRepositories to the
 * RepositoryCoordinators used by services. Coordinator behavior:
 *   1. Read local first (offline-first).
 *   2. Write local, then push to cloud when online.
 *   3. When offline, enqueue via OperationQueue and auto-drain when
 *      connectivity returns.
 *   4. Resolve conflicts by timestamp (newer wins).
 *
 * Each service exposes a small `__attachCloud` seam so the UI/services
 * are never aware of Supabase.
 */

import { CloudKvRepository } from "./core/cloud-store";
import { __attachSettingsCloud } from "./settings/service";
import { __attachReportsCloud } from "./reports/service";
import { __attachVaultCloud } from "./vault/service";
import { __attachHistoryClouds } from "./reports/history";

export function attachCloudRepositories() {
  __attachSettingsCloud(new CloudKvRepository("settings"));
  __attachReportsCloud(new CloudKvRepository("reports"));
  __attachVaultCloud(new CloudKvRepository("vault"));
  __attachHistoryClouds({
    scan: new CloudKvRepository("scan-history"),
    compression: new CloudKvRepository("compression-history"),
    cleanup: new CloudKvRepository("cleanup-history"),
  });
}
