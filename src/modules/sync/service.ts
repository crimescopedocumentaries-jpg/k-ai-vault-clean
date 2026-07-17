/**
 * SyncService — surfaces the queue state and forces drains.
 * Runs automatically via connectivity listener; no manual toggle in the UI.
 */

import { connectivity } from "../core/connectivity";
import { operationQueue } from "../core/queue";

export const SyncService = {
  pending: () => operationQueue.peek().length,
  isOnline: () => connectivity.isOnline,
  drainNow: () => operationQueue.drain(),
  onConnectivity: (fn: (online: boolean) => void) =>
    connectivity.subscribe((s) => fn(s === "online")),
};
