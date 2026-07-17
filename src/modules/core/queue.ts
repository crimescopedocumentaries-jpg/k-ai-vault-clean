/**
 * OperationQueue — durable queue of mutations captured while offline.
 * Drains automatically when connectivity returns.
 */

import { connectivity } from "./connectivity";

export interface QueuedOperation<TPayload = unknown> {
  id: string;
  module: string;
  kind: string;
  payload: TPayload;
  createdAt: number;
  attempts: number;
}

export type OperationHandler = (op: QueuedOperation) => Promise<void>;

const STORAGE_KEY = "kai.opqueue.v1";

class OperationQueue {
  private handlers = new Map<string, OperationHandler>();
  private draining = false;

  constructor() {
    if (typeof window !== "undefined") {
      connectivity.subscribe((s) => {
        if (s === "online") void this.drain();
      });
    }
  }

  register(moduleKind: string, handler: OperationHandler) {
    this.handlers.set(moduleKind, handler);
  }

  enqueue<T>(module: string, kind: string, payload: T): QueuedOperation<T> {
    const op: QueuedOperation<T> = {
      id: crypto.randomUUID(),
      module,
      kind,
      payload,
      createdAt: Date.now(),
      attempts: 0,
    };
    const all = this.read();
    all.push(op as QueuedOperation);
    this.write(all);
    if (connectivity.isOnline) void this.drain();
    return op;
  }

  peek(): QueuedOperation[] {
    return this.read();
  }

  async drain(): Promise<void> {
    if (this.draining || !connectivity.isOnline) return;
    this.draining = true;
    try {
      let queue = this.read();
      const remaining: QueuedOperation[] = [];
      for (const op of queue) {
        const handler = this.handlers.get(`${op.module}:${op.kind}`);
        if (!handler) {
          remaining.push(op);
          continue;
        }
        try {
          await handler(op);
        } catch {
          op.attempts += 1;
          if (op.attempts < 5) remaining.push(op);
        }
      }
      this.write(remaining);
    } finally {
      this.draining = false;
    }
  }

  private read(): QueuedOperation[] {
    if (typeof localStorage === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  }

  private write(ops: QueuedOperation[]) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ops));
  }
}

export const operationQueue = new OperationQueue();
