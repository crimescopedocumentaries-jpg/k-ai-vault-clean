/**
 * Service Interfaces for K-Ai Storage Saver
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  HIGHEST AUTHORITY: /ENGINEERING_CONSTITUTION.md             │
 * │                                                              │
 * │  Mission:  Recover Storage Safely. Protect Memories.         │
 * │  Rule:     Protecting memories > recovering storage.         │
 * │            Reliability > speed. Simplicity > feature count.  │
 * │            Honesty > marketing.                              │
 * │                                                              │
 * │  If any instruction conflicts with the Constitution,         │
 * │  the Constitution wins. No implementation may violate its    │
 * │  principles without a deliberate architectural review.       │
 * └──────────────────────────────────────────────────────────────┘
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

export type PhotoFormat = "jpeg" | "jpg" | "png" | "webp" | "heif" | "heic";
export type VideoFormat = "mp4" | "mov" | "3gp" | "mkv" | "webm" | "mpeg";
export type SupportedFormat = PhotoFormat | VideoFormat | "zip";

export const SUPPORTED_PHOTO_FORMATS: PhotoFormat[] = [
  "jpeg",
  "jpg",
  "png",
  "webp",
  "heif",
  "heic",
];
export const SUPPORTED_VIDEO_FORMATS: VideoFormat[] = [
  "mp4",
  "mov",
  "3gp",
  "mkv",
  "webm",
  "mpeg",
];

export interface MediaItem {
  id: string;
  name: string;
  path: string;
  bytes: number;
  mimeType: string;
  format?: SupportedFormat;
  takenAt?: string;
  thumbnailUri?: string;
  selected?: boolean;
  /** True when K-Ai has already compressed this file. Never compress twice. */
  previouslyCompressed?: boolean;
}

export type CompressionQuality = "high" | "balanced" | "maximum";

export interface CompressionRequest {
  items: string[]; // ids
  quality: CompressionQuality;
  keepOriginals: boolean;
  moveOriginalsToVault: boolean;
  /** Preserve GPS location, timestamps, orientation when supported. */
  preserveMetadata: boolean;
}

/** Per-file pre-flight estimate produced by the Intelligent Decision Engine. */
export interface CompressionEstimate {
  itemId: string;
  currentBytes: number;
  expectedBytes: number;
  expectedSavedBytes: number;
  expectedQuality: "excellent" | "good" | "acceptable";
  etaSeconds: number;
  /** When savings are insignificant, engine reports skip + user-facing reason. */
  recommendation: "compress" | "skip";
  reason?: string;
}

export type CompressionStage =
  | "queued"
  | "estimating"
  | "compressing"
  | "verifying-integrity"
  | "verifying-readability"
  | "verifying-playback"
  | "protecting-original"
  | "replacing"
  | "cleanup"
  | "done"
  | "rolled-back"
  | "skipped";

export interface CompressionProgress {
  jobId: string;
  processed: number;
  total: number;
  skipped: number;
  failed: number;
  currentFile?: string;
  stage: CompressionStage;
  bytesSaved: number;
  etaSeconds: number;
  /** Verified successful files only. Never fake progress. */
  verifiedCount: number;
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

/**
 * Compression Engine contract (photos + videos share this shape).
 *
 * Pipeline per file: estimate → temp output → compress → verify integrity
 * → verify readability → verify playback (video) → protect original in
 * Safe Vault → replace active version → cleanup temp → update DB → refresh
 * insights. Every job is transactional: any failure rolls back atomically.
 * Files previously compressed by K-Ai must be detected and skipped to
 * prevent cumulative quality loss.
 */
export interface CompressionEngine {
  /** Pre-flight per-item estimate. Insignificant savings return recommendation="skip". */
  estimate(request: CompressionRequest): Promise<CompressionEstimate[]>;
  /** Enqueue job. Order: selected → large → recommended → remaining. */
  start(request: CompressionRequest): Promise<string>; // jobId
  pause(jobId: string): Promise<void>;
  resume(jobId: string): Promise<void>;
  cancel(jobId: string): Promise<void>;
  /** Restore originals from Safe Vault when technically possible. */
  undo(jobId: string): Promise<ServiceResult<{ restoredCount: number }>>;
  subscribe(jobId: string, cb: (p: CompressionProgress) => void): () => void;
}

export type CompressionService = CompressionEngine;
export type VideoCompressionService = CompressionEngine;


/* ---------- Safe Vault Engine ----------
 *
 * The Safe Vault protects original media handled by K-Ai. Safety, recoverability
 * and user trust always outrank storage recovery. Every stored original carries
 * a cryptographic fingerprint used only for integrity checks — never tracking.
 * All vault data stays on-device: no cloud sync, no uploads, no hidden copies.
 */

export type VaultRetention = 7 | 30 | 90 | "manual";

export type VaultItemKind = "photo" | "video" | "document";

/** How the original entered the vault. */
export type VaultOrigin =
  | "protected-before-compression"
  | "deleted-through-app"
  | "temporary-recovery-copy";

export interface VaultItemDetail extends VaultItem {
  fingerprint: string; // sha-256 of original bytes; integrity only
  origin: VaultOrigin;
  mimeType: string;
  thumbnailUri?: string;
  jobId?: string;
}

export type VaultHealthLevel = "healthy" | "attention" | "repair-recommended";

export interface VaultHealthReport {
  level: VaultHealthLevel;
  explanation: string; // plain-language, no technical detail
  missingCount: number;
  corruptCount: number;
  metadataDriftCount: number;
  lastCheckedAt: string;
}

/** Estimate produced before storing new originals — powers Low-Storage guardrail. */
export interface VaultSpaceEstimate {
  requiredBytes: number;
  availableBytes: number;
  sufficient: boolean;
  shortfallBytes: number;
}

export type VaultConflictResolution = "replace" | "keep-both" | "skip";

export interface VaultRestoreRequest {
  itemIds: string[];
  /** Applied per-item when the destination file already exists. */
  onConflict: VaultConflictResolution | "ask";
  verify: boolean; // default true — never skip verification silently
}

export type VaultRestoreStage =
  | "queued"
  | "checking-destination"
  | "awaiting-conflict-decision"
  | "restoring"
  | "verifying-readability"
  | "verifying-integrity"
  | "verifying-destination"
  | "done"
  | "skipped"
  | "failed";

export interface VaultRestoreProgress {
  jobId: string;
  itemId: string;
  stage: VaultRestoreStage;
  processed: number;
  total: number;
  verifiedCount: number;
  failedCount: number;
  skippedCount: number;
  /** Present when stage === "awaiting-conflict-decision". */
  conflict?: { itemId: string; destinationPath: string };
}

export type VaultSortKey =
  | "recently-added"
  | "oldest"
  | "largest"
  | "name";

export type VaultFilter = "all" | "photos" | "videos" | "deleted-items";

export interface VaultQuery {
  search?: string; // filename or date fragment
  filter?: VaultFilter;
  sort?: VaultSortKey;
}

export interface SafeVaultService {
  getSummary(): Promise<VaultSummary>;
  listContents(query?: VaultQuery): Promise<VaultItemDetail[]>;
  getItem(itemId: string): Promise<VaultItemDetail>;

  /** Store an original. Computes fingerprint and refuses duplicates. */
  storeOriginal(
    sourcePath: string,
    origin: VaultOrigin,
    jobId?: string,
  ): Promise<ServiceResult<VaultItemDetail>>;

  /** Pre-flight space check. UI must call before enqueueing large batches. */
  estimateSpace(sourcePaths: string[]): Promise<VaultSpaceEstimate>;

  /** Enqueue restore job. Progress stream carries conflict prompts. */
  restore(request: VaultRestoreRequest): Promise<string>; // jobId
  resolveConflict(
    jobId: string,
    itemId: string,
    resolution: VaultConflictResolution,
  ): Promise<void>;

  /** Permanent, irreversible. UI MUST confirm explicitly before calling. */
  delete(itemIds: string[]): Promise<ServiceResult<{ deletedCount: number }>>;

  /** Undo the last restore/delete when still within the reversible window. */
  undo(jobId: string): Promise<ServiceResult<{ reverted: boolean; reason?: string }>>;

  /** Media preview URI — never mutates the original. */
  getPreviewUri(itemId: string): Promise<string>;

  setRetention(retention: VaultRetention): Promise<void>;
  getRetention(): Promise<VaultRetention>;

  /** Verify existence, fingerprints, metadata, references. Background-safe. */
  runHealthCheck(): Promise<VaultHealthReport>;
  getHealth(): Promise<VaultHealthReport>;
  repair(): Promise<ServiceResult<VaultHealthReport>>;

  subscribeRestore(jobId: string, cb: (p: VaultRestoreProgress) => void): () => void;
  subscribeHealth(cb: (r: VaultHealthReport) => void): () => void;
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

/* ---------- Local Database (Room) contract ----------
 *
 * The Android app persists ALL state in an on-device Room database. Nothing
 * leaves the device: no cloud sync, no hidden backups, no analytics, no
 * credentials. These interfaces describe the repository boundary the UI
 * consumes; DAOs stay inside the Android layer. ViewModels talk to
 * repositories only — never Room directly.
 */

export type VaultEntityStatus = "protected" | "restored" | "deleted" | "expired";
export type RestoreStatus = "none" | "pending" | "in-progress" | "verified" | "failed";

export interface VaultEntity {
  id: string;
  filename: string;
  mediaType: "photo" | "video" | "document";
  originalBytes: number;
  protectedBytes: number;
  fingerprint: string;
  createdAt: string;
  retentionUntil: string | null; // null = keep until manual delete
  vaultStatus: VaultEntityStatus;
  restoreStatus: RestoreStatus;
  lastVerifiedAt: string | null;
}

export interface CompressionHistoryEntity {
  jobId: string;
  date: string;
  recoveredBytes: number;
  filesProcessed: number;
  filesSkipped: number;
  filesFailed: number;
  profile: CompressionQuality;
  verification: JobVerification;
  durationSeconds: number;
}

export interface JobCenterEntity {
  jobId: string;
  kind: JobKind;
  status: JobStatus | "paused" | "cancelled";
  progress: number;
  startedAt: string;
  completedAt: string | null;
  pausedAt: string | null;
  cancelledAt: string | null;
  verification: JobVerification | null;
  currentFile: string | null;
  etaSeconds: number | null;
}

export interface ScanResultEntity {
  scanDate: string;
  photosFound: number;
  videosFound: number;
  recoverableBytes: number;
  breakdown: StorageBreakdownEntry[];
  recommendation: string;
  estimatedDurationSeconds: number;
}

export interface StorageInsightsEntity {
  recoveredTodayBytes: number;
  recoveredWeekBytes: number;
  recoveredMonthBytes: number;
  largeVideosBytes: number;
  largePhotosBytes: number;
  screenshotsBytes: number;
  downloadsBytes: number;
  protectedOriginalsBytes: number;
  updatedAt: string;
}

export interface SettingsEntity {
  compressionProfile: CompressionQuality;
  keepOriginals: boolean;
  safeVaultEnabled: boolean;
  retentionPeriod: VaultRetention;
  notificationsEnabled: boolean;
  theme: "system" | "light" | "dark";
  preserveMetadata: boolean;
  reduceMotion: boolean;
}

export type AppScreen =
  | "welcome"
  | "permissions"
  | "home"
  | "scan"
  | "scan-results"
  | "review"
  | "compress"
  | "compress-progress"
  | "complete"
  | "vault"
  | "jobs"
  | "settings";

export interface ApplicationStateEntity {
  currentScreen: AppScreen;
  runningJobId: string | null;
  lastScanAt: string | null;
  pendingRestoreJobId: string | null;
  pendingCompressionJobId: string | null;
  pendingVerificationJobId: string | null;
  appVersion: string;
}

/** Structured DB failure — the UI shows plain-language copy, never SQL. */
export interface DatabaseError extends ServiceError {
  domain:
    | "vault"
    | "compression-history"
    | "jobs"
    | "scan-results"
    | "insights"
    | "settings"
    | "app-state"
    | "schema";
}

export type DatabaseHealthLevel = "healthy" | "repaired" | "attention" | "unavailable";

export interface DatabaseHealthReport {
  level: DatabaseHealthLevel;
  schemaVersion: number;
  tableIntegrityOk: boolean;
  foreignKeyIntegrityOk: boolean;
  vaultConsistencyOk: boolean;
  jobConsistencyOk: boolean;
  autoRepairApplied: boolean;
  explanation: string; // plain-language, no SQL
  checkedAt: string;
}

/** Cached scan freshness — enables "Last scanned 10 minutes ago" reuse. */
export interface ScanCacheStatus {
  hasFreshCache: boolean;
  lastScanAt: string | null;
  storageChangedSinceScan: boolean;
  ageLabel: string;
}

/** Pagination for large lists (vault contents, compression history, jobs). */
export interface Page<T> {
  items: T[];
  nextCursor: string | null;
  totalCount?: number;
}

export interface PageRequest {
  cursor?: string;
  limit: number;
}

/* ---------- Repository interfaces ----------
 * Repositories are the single source of truth. They coordinate Room, native
 * services and the Operation Coordinator. All work runs on background
 * threads; every method is async. ViewModels consume these only.
 */

export interface VaultRepository {
  observe(query?: VaultQuery): AsyncIterable<VaultEntity[]>;
  page(query: VaultQuery, page: PageRequest): Promise<ServiceResult<Page<VaultEntity>>>;
  get(id: string): Promise<ServiceResult<VaultEntity>>;
  upsert(entity: VaultEntity): Promise<ServiceResult<void>>;
  markRestoreStatus(id: string, status: RestoreStatus): Promise<ServiceResult<void>>;
  purgeExpired(now: string): Promise<ServiceResult<{ removedCount: number }>>;
}

export interface CompressionHistoryRepository {
  observeRecent(limit: number): AsyncIterable<CompressionHistoryEntity[]>;
  page(page: PageRequest): Promise<ServiceResult<Page<CompressionHistoryEntity>>>;
  record(entry: CompressionHistoryEntity): Promise<ServiceResult<void>>;
}

export interface JobRepository {
  observe(): AsyncIterable<JobCenterEntity[]>;
  get(jobId: string): Promise<ServiceResult<JobCenterEntity>>;
  upsert(entity: JobCenterEntity): Promise<ServiceResult<void>>;
  markCancelled(jobId: string, at: string): Promise<ServiceResult<void>>;
  markPaused(jobId: string, at: string): Promise<ServiceResult<void>>;
  markCompleted(
    jobId: string,
    at: string,
    verification: JobVerification,
  ): Promise<ServiceResult<void>>;
}

export interface ScanResultRepository {
  latest(): Promise<ServiceResult<ScanResultEntity | null>>;
  cacheStatus(): Promise<ScanCacheStatus>;
  record(result: ScanResultEntity): Promise<ServiceResult<void>>;
  invalidate(): Promise<void>;
}

export interface StorageInsightsRepository {
  observe(): AsyncIterable<StorageInsightsEntity>;
  refresh(): Promise<ServiceResult<StorageInsightsEntity>>;
}

export interface SettingsRepository {
  observe(): AsyncIterable<SettingsEntity>;
  load(): Promise<ServiceResult<SettingsEntity>>;
  update(patch: Partial<SettingsEntity>): Promise<ServiceResult<SettingsEntity>>;
}

/**
 * Application state repository.
 *
 * Powers state recovery after unexpected termination: restores current screen,
 * running jobs, pending operations and user selections. NEVER restarts a
 * completed job — the coordinator checks completion first.
 */
export interface ApplicationStateRepository {
  observe(): AsyncIterable<ApplicationStateEntity>;
  snapshot(): Promise<ServiceResult<ApplicationStateEntity>>;
  update(patch: Partial<ApplicationStateEntity>): Promise<ServiceResult<void>>;
  clearPending(kind: "restore" | "compression" | "verification"): Promise<ServiceResult<void>>;
}

/**
 * Database service — owns lifecycle, migrations and health.
 *
 * On startup: `runHealthCheck()` verifies schema version, table & foreign-key
 * integrity, vault consistency and job consistency; repairs automatically
 * when safe. Migrations are versioned and NEVER silently drop user data.
 */
export interface DatabaseService {
  currentSchemaVersion(): Promise<number>;
  runHealthCheck(): Promise<DatabaseHealthReport>;
  migrateIfNeeded(): Promise<ServiceResult<{ from: number; to: number }>>;
  isAvailable(): Promise<boolean>;
  subscribeAvailability(cb: (available: boolean) => void): () => void;
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
  db: DatabaseService;
  privacy: PrivacyService;
  integrity: IntegrityService;
  audit: AuditService;
  errors: ErrorPresentationService;
  platform: PlatformInfoService;
  qa: QualityAssuranceService;
  release: ReleaseReadinessService;
  ai: AIRecommendationService;
  repositories: {
    vault: VaultRepository;
    compressionHistory: CompressionHistoryRepository;
    jobs: JobRepository;
    scanResults: ScanResultRepository;
    insights: StorageInsightsRepository;
    settings: SettingsRepository;
    appState: ApplicationStateRepository;
  };
};

/* ============================================================
 * SECURITY & PRIVACY SPECIFICATION (v1)
 * ============================================================
 * Version 1 operates ENTIRELY OFFLINE.
 *
 *   - No accounts, no login, no registration.
 *   - No cloud storage, no remote processing.
 *   - No analytics, telemetry, or hidden network traffic.
 *   - No uploads of media, metadata, storage info, preferences,
 *     or job history — ever.
 *   - Users own all media. The app only touches files the user
 *     explicitly selects.
 *
 * These interfaces exist so the UI can:
 *   1. Explain each permission BEFORE requesting it.
 *   2. Show a transparent privacy posture to the user.
 *   3. Verify integrity on startup and repair when safe.
 *   4. Present friendly error messages (never stack traces).
 *
 * The native layer MUST enforce these contracts. The UI
 * layer MUST NOT bypass them.
 * ============================================================ */

/** The complete set of permissions v1 is ever allowed to request. */
export type AppPermission =
  | "media.read"          // read user-selected photos & videos
  | "notifications.post"  // progress for long-running jobs
  | "storage.saf";        // Scoped Storage / SAF fallback

export type PermissionState =
  | "granted"
  | "denied"
  | "denied_permanently"
  | "not_requested"
  | "not_applicable";

/**
 * Human-readable rationale shown to the user BEFORE a system
 * permission prompt appears. Every field is REQUIRED.
 */
export interface PermissionRationale {
  permission: AppPermission;
  /** Plain-language reason ("So we can scan the photos you pick"). */
  whyNeeded: string;
  /** What the app will do with the access. */
  howUsed: string;
  /** How the user can revoke it later (in-app or system settings). */
  howToRevoke: string;
  /** True when the app can still work (in reduced form) without it. */
  optional: boolean;
}

/* ---------- Privacy posture (surfaced in Settings > Privacy) ---------- */

export interface PrivacyPosture {
  offlineOnly: true;
  requiresAccount: false;
  collectsAnalytics: false;
  collectsTelemetry: false;
  performsBackgroundSync: false;
  uploadsMedia: false;
  uploadsMetadata: false;
  /** Bytes ever sent over the network by this app in v1. Always 0. */
  bytesTransmitted: 0;
  /** Timestamp the posture was last self-verified. */
  lastVerifiedAt: string;
}

/**
 * PrivacyService exposes the app's privacy contract to the UI so
 * screens like Settings > Privacy can show honest, verifiable claims
 * instead of marketing copy.
 */
export interface PrivacyService {
  getPosture(): Promise<PrivacyPosture>;
  /**
   * Returns the rationale for a permission. The UI MUST call this
   * and display the result BEFORE invoking permissions.request().
   */
  rationaleFor(permission: AppPermission): Promise<PermissionRationale>;
  /**
   * Returns a plain-language summary of every data category the app
   * retains locally, so the user can make an informed retention choice.
   */
  describeRetainedData(): Promise<Array<{
    category: "vault" | "compression_history" | "scan_cache" | "jobs" | "settings" | "insights";
    description: string;
    userControllable: boolean;
  }>>;
  /** Delete everything the app has stored locally, except user originals. */
  purgeAllLocalData(): Promise<ServiceResult<void>>;
}

/* ---------- Startup integrity checks ---------- */

export type IntegrityCheckId =
  | "database"
  | "vault"
  | "pending_jobs"
  | "application_state";

export type IntegrityCheckStatus =
  | "ok"
  | "repaired"
  | "needs_user_action"
  | "failed";

export interface IntegrityCheckResult {
  id: IntegrityCheckId;
  status: IntegrityCheckStatus;
  /** Friendly message shown to the user when action is required. */
  userMessage?: string;
  /** Optional next step for the UI to guide the user through. */
  guidance?: {
    actionLabel: string;
    actionId: "open_vault" | "resume_jobs" | "reset_state" | "contact_support";
  };
}

export interface IntegrityReport {
  checkedAt: string;
  results: IntegrityCheckResult[];
  overall: IntegrityCheckStatus;
}

/**
 * Runs the startup integrity sweep required by the spec:
 * database, vault, pending jobs, application state. Repairs
 * automatically when safe; otherwise returns guidance the UI
 * presents to the user.
 */
export interface IntegrityService {
  runStartupChecks(): Promise<IntegrityReport>;
  runCheck(id: IntegrityCheckId): Promise<IntegrityCheckResult>;
}

/* ---------- Audit log (local-only) ---------- */

export type AuditEventType =
  | "permission_requested"
  | "permission_granted"
  | "permission_denied"
  | "permission_revoked"
  | "vault_write"
  | "vault_restore"
  | "vault_delete"
  | "compression_completed"
  | "compression_rolled_back"
  | "retention_purge"
  | "privacy_data_purge"
  | "integrity_repair";

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  occurredAt: string;
  /** Short, non-sensitive summary. MUST NOT contain file paths or PII. */
  summary: string;
}

/**
 * A local, append-only log the user can inspect to see what the app
 * has done on their behalf. Never leaves the device. Never contains
 * media bytes, personal identifiers, or private file paths.
 */
export interface AuditService {
  list(page?: number, pageSize?: number): Promise<Page<AuditEvent>>;
  clear(): Promise<ServiceResult<void>>;
}

/* ---------- Friendly error presentation ---------- */

export type FriendlyErrorSeverity = "info" | "warning" | "error";

export interface FriendlyError {
  /** Short title suitable for a dialog or toast. */
  title: string;
  /** Plain-language body. Never a stack trace or exception message. */
  message: string;
  severity: FriendlyErrorSeverity;
  /** What the user can do next. Empty when nothing is actionable. */
  recovery: string[];
  /**
   * Opaque support code the user can reference. Safe to display —
   * contains no PII, no paths, no media content.
   */
  supportCode: string;
}

/**
 * Converts any thrown error, ServiceError, or unknown failure into a
 * FriendlyError. The UI MUST route ALL error surfaces through this
 * service — release builds never expose stack traces or internal
 * exception text.
 */
export interface ErrorPresentationService {
  present(error: unknown, context?: { operation?: string }): FriendlyError;
}

/* ============================================================
 * ANDROID STUDIO IMPLEMENTATION GUIDE (v1)
 * ============================================================
 * These types describe the NATIVE implementation contract the
 * Android app must satisfy. They are surfaced to the UI so the
 * About / Diagnostics screens can display truthful build info
 * without hard-coding strings.
 *
 *   Platform     : Android 10+ (minSdk 29)
 *   Language     : Kotlin
 *   UI           : Jetpack Compose + Material 3
 *   Architecture : MVVM + Repository + Clean Architecture
 *   DI           : Hilt
 *   Async        : Coroutines + StateFlow / SharedFlow
 *   Persistence  : Room (versioned migrations)
 *   Background   : WorkManager + Foreground Services
 *   Media        : MediaStore + Scoped Storage
 * ============================================================ */

export type BuildFlavor = "debug" | "release";

/** Feature modules the Android app is organized into. */
export type FeatureModule =
  | "app"
  | "core"
  | "common"
  | "ui"
  | "storage"
  | "compression"
  | "safevault"
  | "jobcenter"
  | "settings"
  | "notifications"
  | "database"
  | "permissions";

export interface AndroidBuildInfo {
  minSdk: 29;
  targetSdk: number;
  compileSdk: number;
  versionName: string;
  versionCode: number;
  flavor: BuildFlavor;
  /** True when the current build was shrunk (R8) — release only. */
  minified: boolean;
  modules: FeatureModule[];
}

/**
 * Read-only build & platform facts. MUST NOT expose stack traces,
 * file paths, or secrets.
 */
export interface PlatformInfoService {
  getBuildInfo(): Promise<AndroidBuildInfo>;
  /** Human-readable Android release, e.g. "Android 14 (API 34)". */
  getOsRelease(): Promise<string>;
}

/* ============================================================
 * TESTING & QUALITY ASSURANCE (v1)
 * ============================================================
 * Release blockers (ALL must be false to ship):
 *   - Original media can be lost
 *   - Compression corrupts files
 *   - Restore fails
 *   - Application crashes repeatedly
 *   - Critical accessibility issues
 *   - Critical security issues
 * ============================================================ */

export type TestSuiteId =
  | "unit"
  | "integration"
  | "ui"
  | "compression"
  | "safe_vault"
  | "database"
  | "job_center"
  | "performance"
  | "battery"
  | "low_storage"
  | "memory"
  | "stress"
  | "interruption"
  | "security"
  | "accessibility"
  | "compatibility"
  | "regression";

export type TestSuiteStatus = "passing" | "failing" | "skipped" | "not_run";

export interface TestSuiteReport {
  id: TestSuiteId;
  status: TestSuiteStatus;
  total: number;
  passed: number;
  failed: number;
  /** Coverage 0-100. Only meaningful for the unit suite (goal: ≥80). */
  coveragePercent?: number;
  lastRunAt?: string;
}

export type BugSeverity = "critical" | "blocking" | "major" | "minor";

export interface ReleaseBlockerCheck {
  id:
    | "originals_safe"
    | "compression_lossless_or_reversible"
    | "restore_reliable"
    | "crash_free"
    | "accessibility_ok"
    | "security_ok";
  label: string;
  passing: boolean;
  detail?: string;
}

export interface QualityReport {
  generatedAt: string;
  suites: TestSuiteReport[];
  blockers: ReleaseBlockerCheck[];
  /** True only when every blocker passes. */
  releasable: boolean;
}

/**
 * Single honest view of release readiness. Never fabricates green
 * statuses — a missing suite reports "not_run".
 */
export interface QualityAssuranceService {
  getReport(): Promise<QualityReport>;
  getSuite(id: TestSuiteId): Promise<TestSuiteReport>;
}



/* ============================================================
 * GOOGLE PLAY PRODUCTION READINESS (v1)
 * ============================================================
 * Contract used by the internal Release Readiness screen so the
 * team can verify Play Store eligibility BEFORE cutting a build.
 *
 * Baseline release facts for v1:
 *   - Distribution : Android App Bundle (AAB) via Play App Signing
 *   - Min SDK      : 29 (Android 10)
 *   - Target SDK   : latest required by Play at release time
 *   - Data Safety  : on-device processing, no accounts, no ads,
 *                    no analytics, no data sale
 *   - Rollout      : Internal → Closed → (Open) → 10 → 25 → 50 → 100
 * ============================================================ */

export type ReleaseChannel =
  | "internal"
  | "closed"
  | "open"
  | "production_10"
  | "production_25"
  | "production_50"
  | "production_100";

export interface StoreListingAssets {
  appName: string;
  shortDescription: string;
  fullDescription: string;
  iconAssetPresent: boolean;
  featureGraphicPresent: boolean;
  phoneScreenshotCount: number;
  tabletScreenshotCount: number;
  privacyPolicyUrl: string;
  supportEmail: string;
  websiteUrl?: string;
}

export interface DataSafetyDeclaration {
  processesMediaLocallyOnly: true;
  hasUserAccounts: false;
  collectsAnalytics: false;
  usesAdvertisingId: false;
  uploadsUserData: false;
  sellsUserData: false;
  /** Timestamp the declaration was last reviewed against real behavior. */
  lastReviewedAt: string;
}

export type ReleaseCheckId =
  | "aab_format"
  | "play_app_signing"
  | "target_sdk_current"
  | "min_sdk_29"
  | "store_listing_complete"
  | "store_description_truthful"
  | "data_safety_reviewed"
  | "privacy_policy_published"
  | "permissions_minimal"
  | "no_placeholder_text"
  | "no_debug_ui"
  | "no_broken_navigation"
  | "no_missing_icons"
  | "performance_ok"
  | "accessibility_ok"
  | "security_ok"
  | "crash_ready"
  | "version_incremented"
  | "release_notes_written";

export type ReleaseCheckStatus = "pass" | "fail" | "warn" | "unknown";

export interface ReleaseCheck {
  id: ReleaseCheckId;
  label: string;
  status: ReleaseCheckStatus;
  /** Friendly reason shown to the reviewer when status !== "pass". */
  detail?: string;
}

export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
  /** Play version code — must be strictly greater than the previous release. */
  versionCode: number;
}

export interface ReleaseNotes {
  version: SemanticVersion;
  newFeatures: string[];
  improvements: string[];
  bugFixes: string[];
  knownLimitations: string[];
}

export interface RolloutPlan {
  channel: ReleaseChannel;
  /** 0-100. Only meaningful on production_* channels. */
  percent: number;
  /** True when the previous stage's stability window has elapsed. */
  previousStageStable: boolean;
}

export interface ReleaseReadinessReport {
  generatedAt: string;
  version: SemanticVersion;
  listing: StoreListingAssets;
  dataSafety: DataSafetyDeclaration;
  checks: ReleaseCheck[];
  notes: ReleaseNotes;
  rollout: RolloutPlan;
  /** True only when every check passes AND no critical bug is open. */
  releasable: boolean;
}

/**
 * Aggregates every Play-eligibility signal into a single honest report.
 * Never fabricates green statuses; a check with no evidence returns
 * "unknown" and blocks release.
 */
export interface ReleaseReadinessService {
  getReport(): Promise<ReleaseReadinessReport>;
  runCheck(id: ReleaseCheckId): Promise<ReleaseCheck>;
  /** Immediately halt an in-progress staged rollout. */
  pauseRollout(reason: string): Promise<ServiceResult<void>>;
}
