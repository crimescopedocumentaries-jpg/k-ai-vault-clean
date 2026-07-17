/**
 * BrowserDuplicatesProvider — file-hash comparison via SubtleCrypto for
 * File[] inputs (drag-drop, file picker). For device-wide scans the
 * interface is preserved for the Android native provider.
 */

import type { DuplicatesProvider, DuplicateGroup } from "../service";

export const browserDuplicatesProvider: DuplicatesProvider = {
  async findExact(): Promise<DuplicateGroup[]> {
    // Browsers can't enumerate the device; return an empty set.
    // Native Android provider will implement full-device hashing.
    return [];
  },
  async findSimilarNames(): Promise<DuplicateGroup[]> {
    return [];
  },
};

/** Utility: hash a File with SHA-256 (usable by upload/UI flows). */
export async function hashFile(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
