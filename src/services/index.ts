/**
 * Service Interfaces for K-Ai Storage Saver
 *
 * IMPORTANT: These are ABSTRACT interfaces. They intentionally define shape
 * only. Android Studio will provide native implementations via JS bridge /
 * Capacitor / custom WebView bindings. The web frontend must never simulate
 * OS-level behavior beyond returning placeholder data for UI preview.
 */

export interface StorageBreakdownEntry {
  category: "photos" | "videos" | "audio" | "documents" | "apps" | "other";
  label: string;
  bytes: number;
}

export interface StorageSnapshot {
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  recoverableBytes: number;
  healthScore: number; // 0-100
  breakdown: StorageBreakdownEntry[];
}

export interface ScanBucket {
  id: string;
  label: string;
  icon: string;
  fileCount: number;
  totalBytes: number;
  recoverableBytes: number;
  sample?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  path: string;
  bytes: number;
  mimeType: string;
  takenAt?: string;
  thumbnailUri?: string;
  selected?: boolean;
}

export type CompressionQuality = "high" | "balanced" | "maximum";

export interface CompressionRequest {
  items: string[]; // ids
  quality: CompressionQuality;
  keepOriginals: boolean;
  moveOriginalsToVault: boolean;
}

export interface CompressionProgress {
  jobId: string;
  processed: number;
  total: number;
  currentFile?: string;
  bytesSaved: number;
  etaSeconds: number;
}

export interface VaultItem {
  id: string;
  name: string;
  kind: "photo" | "video" | "document";
  bytes: number;
  originalPath: string;
  protectedAt: string;
  retainUntil: string;
}

export interface VaultSummary {
  protectedBytes: number;
  itemCount: number;
  retentionDays: number;
  lastUpdated: string;
  items: {
    photos: number;
    videos: number;
    deletedThroughApp: number;
  };
}

export type JobKind = "compress-photos" | "compress-videos" | "archive-zip" | "vault-restore";
export type JobStatus = "running" | "waiting" | "completed" | "failed";
export type JobVerification = "verified" | "warnings" | "failed";

export interface Job {
  id: string;
  kind: JobKind;
  title: string;
  status: JobStatus;
  progress: number; // 0-100
  bytesSaved?: number;
  itemCount: number;
  startedAt: string;
  finishedAt?: string;
  verification?: JobVerification;
  message?: string;
}

export type PermissionKey =
  | "storage"
  | "media-images"
  | "media-video"
  | "manage-storage"
  | "notifications";

export interface PermissionStatus {
  key: PermissionKey;
  granted: boolean;
  label: string;
  description: string;
}

/* ---------- Service interface contracts ---------- */

export interface StorageScannerService {
  getSnapshot(): Promise<StorageSnapshot>;
  scan(onProgress?: (percent: number) => void): Promise<ScanBucket[]>;
  listBucket(bucketId: string): Promise<MediaItem[]>;
}

export interface CompressionService {
  estimate(request: CompressionRequest): Promise<{ savedBytes: number; etaSeconds: number }>;
  start(request: CompressionRequest): Promise<string>; // jobId
  subscribe(jobId: string, cb: (p: CompressionProgress) => void): () => void;
}

export interface VideoCompressionService extends CompressionService {}

export interface SafeVaultService {
  getSummary(): Promise<VaultSummary>;
  listItems(): Promise<VaultItem[]>;
  restore(itemIds: string[]): Promise<void>;
  purge(itemIds: string[]): Promise<void>;
  setRetentionDays(days: number): Promise<void>;
}

export interface ArchiveService {
  createZip(items: string[], name: string): Promise<string>; // jobId
}

export interface PermissionService {
  status(): Promise<PermissionStatus[]>;
  request(key: PermissionKey): Promise<PermissionStatus>;
  openSettings(): Promise<void>;
}

export interface NotificationService {
  notify(title: string, body: string): Promise<void>;
  areEnabled(): Promise<boolean>;
}

export interface JobCenterService {
  list(): Promise<Job[]>;
  cancel(id: string): Promise<void>;
  retry(id: string): Promise<void>;
  subscribe(cb: (jobs: Job[]) => void): () => void;
}

/* ---------- Placeholder providers (frontend preview only) ----------
 * Android Studio replaces `provideServices()` with real bindings. Until
 * then, screens read from `previewData` so the UI has realistic shapes.
 */
export type Services = {
  scanner: StorageScannerService;
  compression: CompressionService;
  videoCompression: VideoCompressionService;
  vault: SafeVaultService;
  archive: ArchiveService;
  permissions: PermissionService;
  notifications: NotificationService;
  jobs: JobCenterService;
};
