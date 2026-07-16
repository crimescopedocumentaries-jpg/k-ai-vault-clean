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

/* ---------- Structured error contract ----------
 * Native services never surface raw exceptions. Every failure is mapped to
 * a ServiceError with user-facing copy; technical detail stays internal.
 */
export interface ServiceError {
  code: string;
  title: string;
  explanation: string;
  recovery: string;
  retriable: boolean;
}

export type ServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ServiceError };

/* ---------- Service interface contracts ---------- */

export interface StorageScannerService {
  getSnapshot(): Promise<StorageSnapshot>;
  startScan(onProgress?: (percent: number) => void): Promise<ScanBucket[]>;
  cancelScan(): Promise<void>;
  getProgress(): Promise<number>;
  getResults(): Promise<ScanBucket[]>;
  listBucket(bucketId: string): Promise<MediaItem[]>;
}

export interface CompressionService {
  estimate(request: CompressionRequest): Promise<{ savedBytes: number; etaSeconds: number }>;
  compressPhotos(request: CompressionRequest): Promise<string>; // jobId
  pause(jobId: string): Promise<void>;
  resume(jobId: string): Promise<void>;
  cancel(jobId: string): Promise<void>;
  subscribe(jobId: string, cb: (p: CompressionProgress) => void): () => void;
}

export interface VideoCompressionService {
  estimate(request: CompressionRequest): Promise<{ savedBytes: number; etaSeconds: number }>;
  compressVideos(request: CompressionRequest): Promise<string>;
  pause(jobId: string): Promise<void>;
  resume(jobId: string): Promise<void>;
  cancel(jobId: string): Promise<void>;
  subscribe(jobId: string, cb: (p: CompressionProgress) => void): () => void;
}

export interface SafeVaultService {
  getSummary(): Promise<VaultSummary>;
  listContents(): Promise<VaultItem[]>;
  storeOriginal(sourcePath: string): Promise<VaultItem>;
  restore(itemIds: string[]): Promise<void>;
  delete(itemIds: string[]): Promise<void>;
  setRetentionDays(days: number): Promise<void>;
}

export interface ZipArchiveService {
  createZip(items: string[], name: string): Promise<string>; // jobId
  extract(archiveId: string, destination: string): Promise<void>;
  delete(archiveId: string): Promise<void>;
  list(): Promise<{ id: string; name: string; bytes: number; createdAt: string }[]>;
}

export interface PermissionService {
  status(): Promise<PermissionStatus[]>;
  check(key: PermissionKey): Promise<PermissionStatus>;
  request(key: PermissionKey): Promise<PermissionStatus>;
  openSettings(): Promise<void>;
}

export interface NotificationService {
  notifyProgress(jobId: string, title: string, percent: number): Promise<void>;
  notifyCompletion(title: string, body: string): Promise<void>;
  notifyFailure(title: string, body: string): Promise<void>;
  areEnabled(): Promise<boolean>;
}

export interface JobCenterService {
  list(): Promise<Job[]>;
  cancel(id: string): Promise<void>;
  retry(id: string): Promise<void>;
  subscribe(cb: (jobs: Job[]) => void): () => void;
}

export interface AppSettings {
  defaultQuality: CompressionQuality;
  keepOriginals: boolean;
  moveOriginalsToVault: boolean;
  vaultRetentionDays: number;
  notificationsEnabled: boolean;
  reducedMotion: boolean;
  theme: "system" | "light" | "dark";
}

export interface SettingsService {
  load(): Promise<AppSettings>;
  save(settings: Partial<AppSettings>): Promise<AppSettings>;
  validate(settings: Partial<AppSettings>): Promise<ServiceResult<AppSettings>>;
}

export interface StorageInsight {
  id: string;
  icon: string;
  title: string; // e.g. "Large videos", "WhatsApp videos", "Screenshots"
  detail: string;
  bytes: number;
  actionLabel?: string;
}

export interface StorageInsightsService {
  getInsights(): Promise<StorageInsight[]>;
}

export type HealthLevel = "ok" | "attention" | "blocked";

export interface HealthStatus {
  battery: HealthLevel;
  storage: HealthLevel;
  temperature: HealthLevel;
  permissions: HealthLevel;
  interruptions: HealthLevel;
  recommendation?: string; // user-friendly, no technical detail
}

export interface HealthMonitorService {
  getStatus(): Promise<HealthStatus>;
  subscribe(cb: (s: HealthStatus) => void): () => void;
}

/* ---------- Service registry ----------
 * Android Studio replaces `provideServices()` with real native bindings.
 * Until then, screens read from `previewData` for realistic UI shapes.
 */
export type Services = {
  scanner: StorageScannerService;
  compression: CompressionService;
  videoCompression: VideoCompressionService;
  vault: SafeVaultService;
  archive: ZipArchiveService;
  permissions: PermissionService;
  notifications: NotificationService;
  jobs: JobCenterService;
  settings: SettingsService;
  insights: StorageInsightsService;
  health: HealthMonitorService;
};
