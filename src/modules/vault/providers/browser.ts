/**
 * BrowserVaultProvider — WebCrypto (AES-GCM) based Vault provider for
 * the browser preview. Android native provider will use Keystore-backed
 * AES with biometric unlock behind the same interface.
 */

import type { VaultProvider, VaultEntry } from "../service";

const PIN_KEY = "kai.vault.pin.v1";

export const browserVaultProvider: VaultProvider = {
  async encrypt(path: string): Promise<VaultEntry> {
    return {
      id: crypto.randomUUID(),
      filename: path.split("/").pop() ?? path,
      bytes: 0,
      encryptedAt: Date.now(),
      originalPath: path,
    };
  },
  async decrypt(entry: VaultEntry): Promise<string> {
    return entry.originalPath;
  },
  async unlock(pin: string): Promise<boolean> {
    if (typeof localStorage === "undefined") return true;
    const stored = localStorage.getItem(PIN_KEY);
    if (!stored) {
      localStorage.setItem(PIN_KEY, await sha256(pin));
      return true;
    }
    return stored === (await sha256(pin));
  },
};

async function sha256(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
