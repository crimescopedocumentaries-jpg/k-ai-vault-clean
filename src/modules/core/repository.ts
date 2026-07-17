/**
 * RepositoryCoordinator — the ONLY thing Application Services talk to
 * for persistence. Decides read local / read cloud / merge / sync /
 * resolve conflicts. UI never touches Supabase directly.
 */

import { connectivity } from "./connectivity";
import { operationQueue } from "./queue";

export interface LocalRepository<T> {
  get(id: string): Promise<T | null>;
  list(): Promise<T[]>;
  put(id: string, value: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface CloudRepository<T> {
  get(id: string): Promise<T | null>;
  list(): Promise<T[]>;
  put(id: string, value: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export type ConflictResolver<T> = (local: T, cloud: T) => T;

export interface CoordinatorOptions<T> {
  name: string;
  local: LocalRepository<T>;
  cloud?: CloudRepository<T>;
  resolveConflict?: ConflictResolver<T>;
}

/**
 * Local is the source of truth while offline. When online, cloud reads
 * enhance/merge; writes go to local immediately and to cloud when possible,
 * otherwise queued.
 */
export class RepositoryCoordinator<T> {
  constructor(private readonly opts: CoordinatorOptions<T>) {
    if (opts.cloud) {
      operationQueue.register(`${opts.name}:put`, async (op) => {
        const p = op.payload as { id: string; value: T };
        await opts.cloud!.put(p.id, p.value);
      });
      operationQueue.register(`${opts.name}:delete`, async (op) => {
        const p = op.payload as { id: string };
        await opts.cloud!.delete(p.id);
      });
    }
  }

  async get(id: string): Promise<T | null> {
    const local = await this.opts.local.get(id);
    if (!connectivity.isOnline || !this.opts.cloud) return local;
    try {
      const cloud = await this.opts.cloud.get(id);
      if (cloud && local && this.opts.resolveConflict) {
        const merged = this.opts.resolveConflict(local, cloud);
        await this.opts.local.put(id, merged);
        return merged;
      }
      if (cloud && !local) {
        await this.opts.local.put(id, cloud);
        return cloud;
      }
      return local;
    } catch {
      return local;
    }
  }

  async list(): Promise<T[]> {
    return this.opts.local.list();
  }

  async put(id: string, value: T): Promise<void> {
    await this.opts.local.put(id, value);
    if (!this.opts.cloud) return;
    if (connectivity.isOnline) {
      try {
        await this.opts.cloud.put(id, value);
        return;
      } catch {
        /* fall through to queue */
      }
    }
    operationQueue.enqueue(this.opts.name, "put", { id, value });
  }

  async delete(id: string): Promise<void> {
    await this.opts.local.delete(id);
    if (!this.opts.cloud) return;
    if (connectivity.isOnline) {
      try {
        await this.opts.cloud.delete(id);
        return;
      } catch {
        /* fall through */
      }
    }
    operationQueue.enqueue(this.opts.name, "delete", { id });
  }
}
