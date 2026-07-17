/**
 * CloudKvRepository — production CloudRepository backed by Supabase.
 *
 * Every record lives in `public.kai_cloud_kv`, keyed by (user_id, bucket, entry_key).
 * The repository is scoped to a single `bucket` (e.g. "settings", "reports",
 * "vault", "scan-history", "compression-history", "cleanup-history").
 *
 * Design rules:
 *  - Silently no-ops when no user is signed in (offline-first still works).
 *  - Never throws to Application Services on transient failures; the
 *    RepositoryCoordinator/OperationQueue own retries.
 *  - Timestamps for conflict resolution come from the domain object
 *    (via the coordinator's resolveConflict). This layer only persists.
 */

import { supabase } from "@/integrations/supabase/client";
import type { CloudRepository } from "./repository";

type Row = {
  entry_key: string;
  data: unknown;
  updated_at: string;
};

export class CloudKvRepository<T> implements CloudRepository<T> {
  constructor(private readonly bucket: string) {}

  private async userId(): Promise<string | null> {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user?.id ?? null;
    } catch {
      return null;
    }
  }

  async get(id: string): Promise<T | null> {
    const uid = await this.userId();
    if (!uid) return null;
    const { data, error } = await supabase
      .from("kai_cloud_kv")
      .select("data")
      .eq("user_id", uid)
      .eq("bucket", this.bucket)
      .eq("entry_key", id)
      .maybeSingle();
    if (error || !data) return null;
    return data.data as T;
  }

  async list(): Promise<T[]> {
    const uid = await this.userId();
    if (!uid) return [];
    const { data, error } = await supabase
      .from("kai_cloud_kv")
      .select("data")
      .eq("user_id", uid)
      .eq("bucket", this.bucket);
    if (error || !data) return [];
    return (data as Row[]).map((r) => r.data as T);
  }

  async put(id: string, value: T): Promise<void> {
    const uid = await this.userId();
    if (!uid) throw new Error("cloud:unauthenticated");
    const { error } = await supabase.from("kai_cloud_kv").upsert(
      {
        user_id: uid,
        bucket: this.bucket,
        entry_key: id,
        data: value as unknown as object,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,bucket,entry_key" },
    );
    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const uid = await this.userId();
    if (!uid) throw new Error("cloud:unauthenticated");
    const { error } = await supabase
      .from("kai_cloud_kv")
      .delete()
      .eq("user_id", uid)
      .eq("bucket", this.bucket)
      .eq("entry_key", id);
    if (error) throw error;
  }
}
