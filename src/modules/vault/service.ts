/**
 * VaultService.
 * Offline: AES encryption/decryption, PIN, biometrics (Android provider).
 * Online: optional cloud backup + cross-device metadata sync via
 *   CloudKvRepository. Encrypted payloads themselves are never sent
 *   to the cloud by this layer — only metadata.
 */

import { RepositoryCoordinator, type CloudRepository } from "../core/repository";
import { LocalStoreRepository } from "../core/local-store";

export interface VaultEntry {
  id: string;
  filename: string;
  bytes: number;
  encryptedAt: number;
  originalPath: string;
  restoredAt?: number;
  deletedAt?: number;
}

export interface VaultProvider {
  encrypt(path: string): Promise<VaultEntry>;
  decrypt(entry: VaultEntry): Promise<string>;
  unlock(pinOrBio: string): Promise<boolean>;
}

const defaultProvider: VaultProvider = {
  async encrypt(path) {
    return {
      id: crypto.randomUUID(),
      filename: path.split("/").pop() ?? path,
      bytes: 0,
      encryptedAt: Date.now(),
      originalPath: path,
    };
  },
  async decrypt(entry) {
    return entry.originalPath;
  },
  async unlock() {
    return true;
  },
};

let provider: VaultProvider = defaultProvider;
let cloud: CloudRepository<VaultEntry> | undefined;
let repo = build();

function build() {
  return new RepositoryCoordinator<VaultEntry>({
    name: "vault",
    local: new LocalStoreRepository<VaultEntry>("vault"),
    cloud,
    resolveConflict: (l, c) => (l.encryptedAt >= c.encryptedAt ? l : c),
  });
}

export function __attachVaultCloud(c: CloudRepository<VaultEntry>) {
  cloud = c;
  repo = build();
}

export const VaultService = {
  setProvider(p: VaultProvider) {
    provider = p;
  },
  async protect(path: string): Promise<VaultEntry> {
    const entry = await provider.encrypt(path);
    await repo.put(entry.id, entry);
    return entry;
  },
  async restore(id: string): Promise<string | null> {
    const entry = await repo.get(id);
    if (!entry) return null;
    const restoredPath = await provider.decrypt(entry);
    await repo.put(id, { ...entry, restoredAt: Date.now() });
    return restoredPath;
  },
  async remove(id: string): Promise<void> {
    const entry = await repo.get(id);
    if (!entry) return;
    await repo.put(id, { ...entry, deletedAt: Date.now() });
  },
  list: () => repo.list(),
  unlock: (secret: string) => provider.unlock(secret),
};
