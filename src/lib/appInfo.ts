export const APP_INFO = {
  name: "K-Ai Storage Saver",
  version: "1.0.0",
  buildNumber: "100",
  androidVersion: "Android 8.0+",
  storageEngineVersion: "1.0.0",
  safeVaultVersion: "1.0.0",
  databaseVersion: "1",
  developer: "K-Ai Labs",
  website: "https://k-ai-storage-saver.app",
  supportEmail: "support@k-ai-storage-saver.app",
  privacyEmail: "privacy@k-ai-storage-saver.app",
  feedbackEmail: "feedback@k-ai-storage-saver.app",
  playStoreUrl: "https://play.google.com/store/apps/details?id=app.kai.storagesaver",
  lastUpdated: "July 16, 2026",
  effectiveDate: "July 16, 2026",
  tagline: [
    "Recover Storage Safely.",
    "Protect Memories.",
    "Assist Intelligently.",
  ] as const,
};

export const CHANGELOG: {
  version: string;
  date: string;
  highlights: string[];
  improvements: string[];
  bugFixes: string[];
  performance: string[];
  security: string[];
}[] = [
  {
    version: "1.0.0",
    date: "July 16, 2026",
    highlights: [
      "First public release of K-Ai Storage Saver.",
      "On-device AI Storage Advisor and Compression Advisor.",
      "Safe Vault with configurable retention protects every original.",
    ],
    improvements: [
      "Refined Material 3 interface with dynamic theming.",
      "Faster media scanning across large libraries.",
      "Clearer plain-language insights on the dashboard.",
    ],
    bugFixes: [
      "Resolved a rare crash when cancelling long compression jobs.",
      "Fixed retention counter for items restored from Safe Vault.",
    ],
    performance: [
      "Reduced memory usage during batch compression.",
      "Lower background CPU while jobs are paused.",
    ],
    security: [
      "Hardened Safe Vault storage against unauthorised deletion.",
      "All AI inference runs fully offline — no network access required.",
    ],
  },
];

export const OSS_LICENSES: {
  name: string;
  version: string;
  license: string;
}[] = [
  { name: "AndroidX Core", version: "1.13.1", license: "Apache 2.0" },
  { name: "AndroidX AppCompat", version: "1.7.0", license: "Apache 2.0" },
  { name: "Material Components", version: "1.12.0", license: "Apache 2.0" },
  { name: "Kotlin Standard Library", version: "2.0.20", license: "Apache 2.0" },
  { name: "Kotlin Coroutines", version: "1.8.1", license: "Apache 2.0" },
  { name: "Jetpack Compose", version: "1.7.0", license: "Apache 2.0" },
  { name: "Room", version: "2.6.1", license: "Apache 2.0" },
  { name: "WorkManager", version: "2.9.1", license: "Apache 2.0" },
  { name: "DataStore", version: "1.1.1", license: "Apache 2.0" },
  { name: "Media3 / ExoPlayer", version: "1.4.1", license: "Apache 2.0" },
  { name: "Glide", version: "4.16.0", license: "BSD, MIT, Apache 2.0" },
  { name: "libjpeg-turbo", version: "3.0.3", license: "BSD-3-Clause" },
  { name: "FFmpegKit (LTS)", version: "6.0-2", license: "LGPL 3.0" },
  { name: "Zstandard", version: "1.5.6", license: "BSD-3-Clause" },
  { name: "SQLite", version: "3.46.0", license: "Public Domain" },
  { name: "TensorFlow Lite", version: "2.16.1", license: "Apache 2.0" },
];
