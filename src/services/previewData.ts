/**
 * Preview-only data. Replaced by native Android bindings at runtime.
 * Do NOT add business logic here — only realistic shapes for the UI.
 */
import type {
  Job,
  MediaItem,
  ScanBucket,
  StorageSnapshot,
  VaultSummary,
  PermissionStatus,
} from ".";

export const previewSnapshot: StorageSnapshot = {
  totalBytes: 128 * 1024 ** 3,
  usedBytes: 96.4 * 1024 ** 3,
  freeBytes: 31.6 * 1024 ** 3,
  recoverableBytes: 14.6 * 1024 ** 3,
  healthScore: 82,
  breakdown: [
    { category: "photos", label: "Photos", bytes: 28.4 * 1024 ** 3 },
    { category: "videos", label: "Videos", bytes: 42.1 * 1024 ** 3 },
    { category: "apps", label: "Apps", bytes: 14.8 * 1024 ** 3 },
    { category: "audio", label: "Audio", bytes: 4.7 * 1024 ** 3 },
    { category: "documents", label: "Documents", bytes: 2.1 * 1024 ** 3 },
    { category: "other", label: "Other", bytes: 4.3 * 1024 ** 3 },
  ],
};

export const previewBuckets: ScanBucket[] = [
  {
    id: "wa-videos",
    label: "WhatsApp Videos",
    icon: "smart_display",
    fileCount: 128,
    totalBytes: 8.2 * 1024 ** 3,
    recoverableBytes: 6.1 * 1024 ** 3,
    sample: "Old chat videos",
  },
  {
    id: "large-videos",
    label: "Large Videos",
    icon: "movie",
    fileCount: 42,
    totalBytes: 12.4 * 1024 ** 3,
    recoverableBytes: 5.2 * 1024 ** 3,
    sample: "Videos larger than 100 MB",
  },
  {
    id: "camera-photos",
    label: "Camera Photos",
    icon: "photo_camera",
    fileCount: 2140,
    totalBytes: 6.4 * 1024 ** 3,
    recoverableBytes: 1.8 * 1024 ** 3,
    sample: "High-resolution originals",
  },
  {
    id: "screenshots",
    label: "Screenshots",
    icon: "screenshot",
    fileCount: 486,
    totalBytes: 1.2 * 1024 ** 3,
    recoverableBytes: 0.9 * 1024 ** 3,
    sample: "Rarely opened after 30 days",
  },
  {
    id: "downloads",
    label: "Downloads",
    icon: "download",
    fileCount: 92,
    totalBytes: 2.1 * 1024 ** 3,
    recoverableBytes: 0.6 * 1024 ** 3,
    sample: "PDFs, installers, archives",
  },
  {
    id: "large-photos",
    label: "Large Photos",
    icon: "image",
    fileCount: 214,
    totalBytes: 1.9 * 1024 ** 3,
    recoverableBytes: 0.7 * 1024 ** 3,
    sample: "RAW and burst captures",
  },
];

export const previewMedia = (bucketId: string): MediaItem[] =>
  Array.from({ length: 12 }).map((_, i) => ({
    id: `${bucketId}-${i}`,
    name: `IMG_${2000 + i}.${bucketId.includes("video") ? "mp4" : "jpg"}`,
    path: `/storage/emulated/0/${bucketId}/IMG_${2000 + i}`,
    bytes: (bucketId.includes("video") ? 220 : 8) * 1024 * 1024 + i * 900_000,
    mimeType: bucketId.includes("video") ? "video/mp4" : "image/jpeg",
    selected: true,
  }));

export const previewVault: VaultSummary = {
  protectedBytes: 5.2 * 1024 ** 3,
  itemCount: 312,
  retentionDays: 30,
  lastUpdated: "2 hours ago",
  items: {
    photos: 214,
    videos: 78,
    deletedThroughApp: 20,
  },
};

export const previewVaultBytes = {
  photos: 3.8 * 1024 ** 3,
  videos: 1.4 * 1024 ** 3,
  deletedThroughApp: 820 * 1024 ** 2,
};

export type VaultEntry = {
  id: string;
  name: string;
  bytes: number;
  protectedAt: string;
  protectedAtDays: number;
  kind: "photo" | "video" | "zip";
  durationSec?: number;
  deletedAt?: string;
  retentionDaysLeft?: number;
};

const day = (n: number) => {
  if (n === 0) return "Today";
  if (n === 1) return "Yesterday";
  return `${n} days ago`;
};

export const previewProtectedPhotos: VaultEntry[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `pp-${i}`,
  name: `IMG_${20240100 + i}.jpg`,
  bytes: (6 + (i % 7) * 2.3) * 1024 * 1024,
  protectedAt: day(i % 14),
  protectedAtDays: i % 14,
  kind: "photo",
}));

export const previewProtectedVideos: VaultEntry[] = Array.from({ length: 16 }).map((_, i) => ({
  id: `pv-${i}`,
  name: `VID_${20240100 + i}.mp4`,
  bytes: (120 + (i % 5) * 55) * 1024 * 1024,
  protectedAt: day((i + 1) % 20),
  protectedAtDays: (i + 1) % 20,
  kind: "video",
  durationSec: 30 + (i % 8) * 45,
}));

export const previewDeletedItems: VaultEntry[] = [
  ...Array.from({ length: 8 }).map<VaultEntry>((_, i) => ({
    id: `dp-${i}`,
    name: `IMG_${20231200 + i}.jpg`,
    bytes: (4 + i) * 1024 * 1024,
    protectedAt: day(20 + i),
    protectedAtDays: 20 + i,
    deletedAt: day(i + 2),
    retentionDaysLeft: 30 - (i + 2),
    kind: "photo",
  })),
  ...Array.from({ length: 8 }).map<VaultEntry>((_, i) => ({
    id: `dv-${i}`,
    name: `VID_${20231200 + i}.mp4`,
    bytes: (80 + i * 20) * 1024 * 1024,
    protectedAt: day(15 + i),
    protectedAtDays: 15 + i,
    deletedAt: day(i + 4),
    retentionDaysLeft: 30 - (i + 4),
    kind: "video",
    durationSec: 60 + i * 20,
  })),
  ...Array.from({ length: 4 }).map<VaultEntry>((_, i) => ({
    id: `dz-${i}`,
    name: `Archive_${i + 1}.zip`,
    bytes: (200 + i * 40) * 1024 * 1024,
    protectedAt: day(10 + i),
    protectedAtDays: 10 + i,
    deletedAt: day(i + 1),
    retentionDaysLeft: 30 - (i + 1),
    kind: "zip",
  })),
];

export const previewJobs: Job[] = [
  {
    id: "j-1",
    kind: "compress-videos",
    title: "Compressing WhatsApp videos",
    status: "running",
    progress: 62,
    itemCount: 128,
    startedAt: "just now",
    bytesSaved: 3.8 * 1024 ** 3,
  },
  {
    id: "j-2",
    kind: "compress-photos",
    title: "Compress Camera Photos",
    status: "waiting",
    progress: 0,
    itemCount: 214,
    startedAt: "queued",
  },
  {
    id: "j-3",
    kind: "compress-videos",
    title: "Compress Large Videos",
    status: "completed",
    progress: 100,
    itemCount: 42,
    startedAt: "1 hour ago",
    finishedAt: "48 min ago",
    verification: "verified",
    bytesSaved: 5.2 * 1024 ** 3,
  },
  {
    id: "j-4",
    kind: "archive-zip",
    title: "Downloads.zip",
    status: "completed",
    progress: 100,
    itemCount: 92,
    startedAt: "yesterday",
    finishedAt: "yesterday",
    verification: "warnings",
    message: "2 files skipped (locked)",
    bytesSaved: 0.4 * 1024 ** 3,
  },
  {
    id: "j-5",
    kind: "compress-photos",
    title: "Compress Old Screenshots",
    status: "failed",
    progress: 34,
    itemCount: 486,
    startedAt: "yesterday",
    finishedAt: "yesterday",
    verification: "failed",
    message: "Storage permission revoked",
  },
];

export const previewPermissions: PermissionStatus[] = [
  {
    key: "media-images",
    label: "Photos and media",
    description: "Needed to find and safely compress your images.",
    granted: false,
  },
  {
    key: "media-video",
    label: "Videos",
    description: "Needed to find and safely compress your videos.",
    granted: false,
  },
  {
    key: "manage-storage",
    label: "All files access",
    description: "Required to organise downloads and create ZIP archives.",
    granted: false,
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "So we can tell you when a long job finishes.",
    granted: false,
  },
];
