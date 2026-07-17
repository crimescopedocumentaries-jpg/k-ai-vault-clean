/**
 * MemoryLocalRepository — default LocalRepository backed by localStorage.
 * Replaceable with a Capacitor SQLite/Room adapter on native builds
 * without touching Application Services.
 */

import type { LocalRepository } from "./repository";

export class LocalStoreRepository<T> implements LocalRepository<T> {
  constructor(private readonly namespace: string) {}

  private key(id: string) {
    return `kai.repo.${this.namespace}.${id}`;
  }
  private indexKey() {
    return `kai.repo.${this.namespace}.__index`;
  }
  private readIndex(): string[] {
    if (typeof localStorage === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(this.indexKey()) ?? "[]");
    } catch {
      return [];
    }
  }
  private writeIndex(ids: string[]) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(this.indexKey(), JSON.stringify(ids));
  }

  async get(id: string): Promise<T | null> {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(this.key(id));
    return raw ? (JSON.parse(raw) as T) : null;
  }
  async list(): Promise<T[]> {
    const ids = this.readIndex();
    const out: T[] = [];
    for (const id of ids) {
      const v = await this.get(id);
      if (v) out.push(v);
    }
    return out;
  }
  async put(id: string, value: T): Promise<void> {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(this.key(id), JSON.stringify(value));
    const idx = this.readIndex();
    if (!idx.includes(id)) {
      idx.push(id);
      this.writeIndex(idx);
    }
  }
  async delete(id: string): Promise<void> {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(this.key(id));
    this.writeIndex(this.readIndex().filter((x) => x !== id));
  }
}
