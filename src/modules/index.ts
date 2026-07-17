/**
 * K-Ai Modules — Offline-First + Cloud-Enhanced Application Services.
 *
 * The UI imports ONLY from this file. Modules internally decide whether
 * to run locally (offline) or with cloud enhancement (online).
 */

export { AIService } from "./ai/service";
export { StorageService } from "./storage/service";
export { DuplicatesService } from "./duplicates/service";
export { CompressionService } from "./compression/service";
export { VaultService } from "./vault/service";
export { CleanupService } from "./cleanup/service";
export { ReportsService } from "./reports/service";
export { SettingsService } from "./settings/service";
export { AuthService } from "./auth/service";
export { SyncService } from "./sync/service";
export { NotificationsService } from "./notifications/service";

// Core primitives (advanced usage / native adapters)
export { connectivity } from "./core/connectivity";
export { operationQueue } from "./core/queue";
export { RepositoryCoordinator } from "./core/repository";
export { LocalStoreRepository } from "./core/local-store";
