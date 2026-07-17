/**
 * BrowserCleanupProvider — the browser cannot enumerate device caches;
 * this provider is a safe no-op. Android native provider will implement
 * cache/temp/empty-folder detection behind the same interface.
 */

import type { CleanupProvider } from "../service";

export const browserCleanupProvider: CleanupProvider = {
  async scan() {
    return [];
  },
  async remove() {
    return 0;
  },
};
