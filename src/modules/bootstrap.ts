/**
 * Module bootstrap — registers the browser providers with each Application
 * Service. Called once from the app root. Native Android builds replace
 * this file (or its imports) with Capacitor-backed providers without
 * touching UI, Application Services, or the RepositoryCoordinator.
 *
 * Also attaches CloudRepositories to the coordinators that support
 * cross-device sync (settings, reports, vault). All writes go local
 * first and are queued for cloud drain when connectivity returns.
 */

import { StorageService } from "./storage/service";
import { DuplicatesService } from "./duplicates/service";
import { CompressionService } from "./compression/service";
import { VaultService } from "./vault/service";
import { CleanupService } from "./cleanup/service";
import { NotificationsService } from "./notifications/service";

import { browserStorageProvider } from "./storage/providers/browser";
import { browserDuplicatesProvider } from "./duplicates/providers/browser";
import { browserCompressionProvider } from "./compression/providers/browser";
import { browserVaultProvider } from "./vault/providers/browser";
import { browserCleanupProvider } from "./cleanup/providers/browser";
import { browserNotificationsProvider } from "./notifications/providers/browser";

import { attachCloudRepositories } from "./cloud-wiring";

let booted = false;

export function bootstrapModules() {
  if (booted) return;
  booted = true;

  StorageService.setProvider(browserStorageProvider);
  DuplicatesService.setProvider(browserDuplicatesProvider);
  CompressionService.setProvider(browserCompressionProvider);
  VaultService.setProvider(browserVaultProvider);
  CleanupService.setProvider(browserCleanupProvider);
  NotificationsService.setProvider(browserNotificationsProvider);

  attachCloudRepositories();
}
