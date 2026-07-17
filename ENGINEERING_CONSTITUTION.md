# K-Ai Storage Saver — Engineering Constitution

**Version:** 2.1 (+ Amendment A1)
**Status:** HIGHEST AUTHORITY — MANDATORY — CRITICAL

> If any future instruction, prompt, feature request, or generated code conflicts with this document, **this document wins.**

> **Revision History**
> - **1.0 Rev A** — Integrated on-device AI assistance across all sections.
> - **2.1** — Chief Software Architect Directive: adopts a permanent **Native-First** architecture. React/Lovable is UI only; every Android system capability is implemented in Kotlin behind Capacitor plugins.
> - **Amendment A1** — Offline-First Architecture and Application Service Layer Governance (see Part III below). Permanent, mandatory, effective immediately.


---

## Mission

- Recover Storage Safely.
- Protect Memories.
- Provide intelligent on-device recommendations that help users make better storage decisions.
- Deliver a fast, secure, battery-efficient, offline-capable Android application that feels completely native.

Every engineering decision must reinforce these promises.

## Vision

Build the most trusted AI-assisted Android storage recovery application. **Trust is the primary product feature.** Intelligence must always increase — never reduce — that trust.

## Product Philosophy

- Protecting memories > recovering storage.
- Reliability > speed.
- Simplicity > feature count.
- Honesty > marketing.
- AI supports the user. AI never replaces the user. Users always remain in control.
- Native Android capability > JavaScript convenience.

## AI Philosophy

Artificial Intelligence exists to **assist** — not automate, not replace, not confuse.

AI shall: Explain · Recommend · Predict · Prioritize · Optimize.

AI shall **never** perform destructive actions without explicit user approval.

---

# PART I — ARCHITECTURE CONSTITUTION (v2.1)

## Architecture Principle

K-Ai Storage Saver is a production-grade Android application that combines:

- **Lovable React UI** (presentation)
- **Capacitor Bridge** (transport)
- **Native Android Core** (system of record)
- **Kotlin Plugins** (capabilities)
- **Secure Android APIs** (platform)

React/Lovable is responsible ONLY for:

- User Interface · User Experience · Navigation · State Management · User Interaction · Visualization · Dashboards · Analytics Display · Settings · Theme · Accessibility

React SHALL NEVER become responsible for Android operating system functionality. The Native Android Core is the system of record.

## Permanent Native-First Rule

If Android provides a native capability that is faster, more secure, more battery efficient, better integrated, more reliable, or more maintainable — **it SHALL be implemented natively in Kotlin.**

- JavaScript shall only invoke native functionality through Capacitor.
- Never duplicate Android operating system logic inside React.
- Native implementations are always the source of truth.

## React Responsibilities

**React SHALL manage:**
✓ UI · UX · Navigation · State · Forms · User Preferences · Dashboards · Progress · Charts · Animations · Theme · AI Result Presentation

**React SHALL NEVER:**
✗ Scan Android storage
✗ Compress files
✗ Encrypt files
✗ Delete files
✗ Access MediaStore directly
✗ Execute background workers
✗ Manage Android permissions
✗ Handle biometric authentication
✗ Access Android Keystore
✗ Index storage
✗ Detect duplicates
✗ Manage file system security

## Native Android Core

Native functionality SHALL be implemented in Kotlin. Mandatory plugin architecture:

- `StorageScannerPlugin`
- `CompressionPlugin`
- `DuplicateFinderPlugin`
- `SpaceRecoveryPlugin`
- `VaultPlugin`
- `SecureDeletePlugin`
- `MediaAnalyzerPlugin`
- `FileIndexPlugin`
- `DeviceStoragePlugin`
- `StorageHealthPlugin`
- `PermissionManagerPlugin`
- `BackgroundTaskPlugin`
- `ThumbnailGeneratorPlugin`

Every plugin shall expose a clean Capacitor interface. React communicates ONLY through those interfaces.

## Performance Rule

When choosing between a React implementation and a Native implementation, **Native SHALL always be selected** whenever any of the following exist: File I/O · Compression · Encryption · Background execution · Battery optimization · MediaStore · Android permissions · Storage APIs.

Performance takes precedence over convenience.

## Security Rule

Sensitive functionality SHALL NEVER execute inside JavaScript. This includes:

- AES Encryption
- Android Keystore
- Secure Delete
- Vault Lock
- Key Generation
- Biometrics
- Permission Management

Security-sensitive code belongs exclusively in Kotlin.

## Background Processing

Long-running operations SHALL use:

- WorkManager
- Foreground Services
- Native Coroutines
- JobScheduler where appropriate

React SHALL NEVER remain active merely to keep background jobs alive.

## Media Management

Media indexing SHALL use MediaStore · ContentResolver · Storage Access Framework. Recursive JavaScript storage scanning is prohibited.

## File Compression

Compression engines SHALL be native. React SHALL only display progress, savings, completion, and cancellation. Support future expansion for images, videos, documents, audio, and archives.

## Safe Vault

Safe Vault SHALL use Android Keystore · AES-256 encryption · Encrypted Storage · BiometricPrompt. React SHALL NEVER access encryption keys.

Safe Vault remains the foundation of user trust. Every workflow must preserve original media until successful completion. AI may explain retention, restore impact, vault health, and integrity. **AI shall never permanently delete media.** Never bypass Safe Vault rules.

## Dependency Governance Rule

No third-party library, plugin, SDK, or dependency shall be introduced unless it provides measurable architectural value. Before adding any dependency, evaluate: Security · Maintenance activity · Community adoption · Long-term support · Licensing compatibility · APK size impact · Performance impact · Battery impact · Privacy implications · Compatibility with K-Ai architecture.

Prefer Android Jetpack libraries over third-party alternatives whenever possible. Remove unused dependencies immediately. Dependency convenience SHALL NEVER outweigh architectural quality.

## Clean Architecture Rule

Maintain clear separation between:

- Presentation Layer (React/Lovable)
- Business Logic Layer
- Native Service Layer (Kotlin plugins)
- Android Platform Layer

No UI component shall directly access Android system services.

## Offline-First Rule

Core functionality shall remain operational without internet whenever technically possible. Network access shall enhance the experience — never be required for basic storage management. Version 1 operates completely offline. **All AI inference runs on-device.** No cloud AI. No online inference. No remote machine learning. No uploading photos, videos, or metadata — ever.

## AI Governance

AI features SHALL:

- Explain recommendations
- Never fabricate storage information
- Never delete files automatically
- Always require user confirmation for destructive actions
- Respect user privacy

AI acts as an assistant, never as an autonomous controller.

AI **may** recommend, prioritize, and estimate.
AI **shall NEVER** delete files automatically, compress automatically, move files automatically, or override user decisions.

## Plugin Lifecycle Rule

Every native plugin shall be independently testable, independently replaceable, backward-compatible where practical, semantically versioned, and expose stable interfaces.

## Code Quality Rule

Every module shall be modular, reusable, documented, testable, and maintainable. Avoid duplicated logic. Keep components small and focused.

## Testing Rule

Critical native modules shall include unit tests, integration tests where appropriate, error handling, and graceful recovery. No critical storage operation should fail silently.

## Documentation Rule

Every major feature shall include technical documentation, API documentation, architecture notes, and usage examples. Documentation is part of the deliverable.

## Versioning Rule

All architecture changes shall preserve migration paths whenever possible. Breaking changes must be documented before implementation.

## Future Extensibility

Every future Android capability shall be added as an independent native plugin. The UI shall remain implementation-independent. No screen shall require redesign because of improvements to native capabilities.

## Chief Software Architect Compliance Rule

Before implementing any feature, answer:

1. Is this an Android system capability?
2. Does Android already provide a native API?
3. Will native implementation improve performance?
4. Will native implementation improve battery efficiency?
5. Will native implementation improve security?
6. Will native implementation improve maintainability?
7. Will native implementation improve scalability?

If ANY answer is YES: **implement the feature natively.** Expose functionality only through a clean Capacitor plugin interface.

Never bypass the architecture. Never compromise security for convenience. Never compromise maintainability for speed. Every implementation shall strengthen — not weaken — the long-term quality of K-Ai Storage Saver.

---

# PART II — PRODUCT & AI CONSTITUTION

## Version 1 Principles

Version 1 is intentionally focused. Every feature must directly support storage recovery, memory protection, or intelligent on-device assistance.

## Engineering Values

Safety First · Privacy First · Offline First · Accessibility First · Maintainability First · Transparency First · **Native-First** · **AI-Assisted, User-Controlled**.

## User Experience

Every interaction must be Simple · Predictable · Friendly · Professional · Reassuring. Users should never wonder *What happened? Why? What happens next?* AI explanations exist to answer those questions in plain language.

## Data Safety

- Never overwrite original files directly.
- Always verify compressed media.
- Always support restoration whenever technically possible.
- AI may recommend, prioritize, or estimate — never delete, compress, or move files on its own.
- Never risk user memories.

## Undo

Available whenever technically possible. If unavailable, explain why.

## Privacy

No accounts. No login. No registration. No advertising. No analytics. No hidden tracking. User media never leaves the device. AI processing occurs entirely on the device.

## Android Platform

Respect MediaStore, Scoped Storage, WorkManager, Foreground Services, and modern Android APIs. Avoid deprecated APIs. On-device AI uses standard Android ML runtimes (TensorFlow Lite / NNAPI / MediaPipe) with bundled models — no runtime downloads.

## User Interface

Material Design 3. Consistent spacing, typography, animations, navigation. No visual clutter. The Home Dashboard surfaces **exactly one** intelligent recommendation at a time. Recommendations must always be Relevant · Actionable · Transparent.

## AI Features (Version 1)

### AI Storage Advisor
Analyzes storage usage, media categories, large files, recently added media, and storage trends. Produces recommendations such as: *Compress WhatsApp videos · Compress large videos · Archive old media · Review downloads · Avoid compressing already optimized media.*

### AI Compression Advisor
Before compression, estimates recoverable space, expected quality, compression time, expected storage savings, and confidence level. Recommends High Quality · Balanced · Maximum Space Saving, and explains why.

### AI Storage Health
Replaces generic storage scores with intelligent summaries, e.g. *Storage is healthy · Videos are consuming most of your storage · Photos are already optimized · Large videos offer the greatest recovery potential.*

### AI Smart Insights
Automatically detects WhatsApp videos, camera videos, screenshots, downloads, large media, old media, frequently duplicated folders, and unused archives.

### AI Job Assistant
Translates technical failures into friendly language.

### AI Recovery Advisor
When restoring media, explains what will be restored, storage impact, Safe Vault status, and potential conflicts.

## AI Recommendation Engine

The Home Dashboard shows only ONE recommendation at a time. Every recommendation includes **Accept · Dismiss · Learn More**.

## User Control

Users may disable AI recommendations in Settings, reset recommendation history, and continue using every non-AI feature. No AI feature ever requires internet.

## Performance

Never block the UI thread. Use background processing. Support large media libraries. Recover gracefully from interruptions. On-device inference runs off the UI thread and degrades gracefully on lower-tier devices.

## Security

Protect user data. Request minimum permissions. Explain every permission. Never expose technical details. **AI shall never access external servers. No cloud AI. No online inference. No user tracking. No advertising profile.**

## Quality

No placeholder screens. No unfinished workflows. No fake progress. No fake scanning. **No fake AI** — every AI output is produced by a real on-device engine or clearly labeled unavailable. No misleading storage estimates.

## Honesty

Never exaggerate compression, storage savings, recovery, performance, or AI capability. AI must communicate confidence and uncertainty honestly.

## Google Play

Comply with current Google Play policies. Maintain accurate Data Safety disclosures and Privacy Policy.

Marketed as: *On-device intelligent storage recommendations · AI-assisted storage optimization · Privacy-first AI.*

Do **NOT** market as: Generative AI · ChatGPT · Large Language Model · Cloud AI.

## Implementation — On-Device Engines

The following engines are required and live behind service interfaces (see `src/services/index.ts` for the UI-side contracts; the actual work executes inside native Kotlin plugins per Part I):

- `AIRecommendationService`
- `StorageAnalysisEngine`
- `CompressionPredictionEngine`
- `HealthInsightEngine`
- `RecommendationRepository`

All operate entirely on-device.

## Future Features (NOT v1)

Encrypted Safe Vault extensions · Cloud Backup · Duplicate Detection (automated) · Generative AI Recommendations · Password Protection.

## Change Management

Every proposed change must answer:

1. Does it improve user trust?
2. Does it simplify the product?
3. Does it protect user memories?
4. Does it support the mission (recover, protect, assist)?
5. Does it preserve on-device privacy?
6. Does it respect the Native-First rule?

If any answer is "No", do not implement it.

## Design Freeze

After Release Candidate 1, only changes related to Critical Bugs · Security · Accessibility · Google Play Compliance · Performance · AI correctness · Native plugin correctness are permitted.

## Success Definition

K-Ai Storage Saver succeeds when users say: *"I trust this app with my photos, and its suggestions actually help."*

## Final Rule

Whenever uncertainty exists, choose the option that:

- Protects user memories.
- Improves user trust.
- Keeps the application simple.
- Improves long-term maintainability.
- Keeps intelligence on-device and under user control.
- Keeps Android system capabilities native.

## Final Acceptance Criteria

Version 1 is complete only when:

- The application is stable.
- Original media is protected.
- Compression is reliable and native.
- Safe Vault works correctly on Android Keystore + AES-256 + BiometricPrompt.
- Undo works where supported.
- The UI is polished.
- Accessibility is supported.
- Privacy commitments are honored.
- All AI runs on-device and honors the AI Decision Engine rules.
- All Android system capabilities are implemented via Kotlin Capacitor plugins.
- Google Play requirements are met.
- The application delivers a premium, AI-assisted, natively-implemented Android experience.

---

## Final Constitutional Directive

This Engineering Constitution is the highest technical authority for K-Ai Storage Saver.

If any future prompt, implementation, feature request, or generated code conflicts with this Constitution, **the Constitution SHALL take precedence.** All future development must comply with these architectural principles.

**Recover Storage Safely. Protect Memories. Assist Intelligently. Build Natively.**

---

# PART III — AMENDMENT A1 (MANDATORY, PERMANENT)

## Offline-First Architecture and Application Service Layer Governance

**Status:** MANDATORY. Permanent amendment to the Engineering Constitution. Supersedes any conflicting implementation decisions. Applies to existing code, future code, refactoring, new features, bug fixes, AI-generated code, Android implementation, Capacitor integration, Supabase integration, cloud services, and native providers.

**Enforcement policy for existing conflicts:**

1. Do NOT immediately rewrite working code.
2. Record the conflict as **Architecture Technical Debt**.
3. All future implementations MUST comply with this amendment.
4. Never introduce new violations.
5. Progressively eliminate existing violations during future refactoring.

### Article 1 — Single Source of Business Logic

The Application Service Layer is the ONLY entry point into business logic. Every business operation flows through an Application Service: `StorageService`, `CompressionService`, `DuplicatesService`, `VaultService`, `CleanupService`, `ReportsService`, `SettingsService`, `NotificationsService`, `AuthService`, `SyncService`, `AIService`. No business logic shall exist inside UI components.

### Article 2 — UI Independence

React components, routes, pages, dialogs, hooks, and UI utilities MUST NEVER communicate directly with: Supabase, cloud APIs, AI providers, native Android APIs, repository implementations, database adapters, storage adapters, filesystem providers, encryption providers, notification providers, background workers, MediaStore, SAF, Capacitor plugins, WorkManager, or any external infrastructure. The UI may communicate ONLY with the Application Service Layer.

### Article 3 — Infrastructure Isolation

Every infrastructure implementation MUST be hidden behind an interface: `StorageProvider`, `CloudRepository`, `LocalRepository`, `AIProvider`, `NotificationProvider`, `VaultProvider`, `CompressionProvider`, `DuplicateProvider`, `BrowserProvider`, `AndroidProvider`. Future providers must be replaceable without modifying the UI.

### Article 4 — Offline-First Principle

Every feature MUST define:
1. **Minimum Offline Capability** — always available without internet.
2. **Online Enhancement** — additive when connectivity exists.

Core functionality must never depend on internet connectivity. Cloud services enhance but never replace core functionality.

### Article 5 — AI Architecture

The UI MUST NEVER communicate directly with AI models. All AI requests flow:

```
UI → AIService → AIRouter → LocalAIProvider | CloudAIProvider
```

The `AIRouter` chooses the provider. The UI must remain unaware of which provider answered.

### Article 6 — Repository Pattern

The UI MUST NEVER communicate directly with repositories. Data flow:

```
Application Service → RepositoryCoordinator → LocalRepository (→ optional CloudRepository)
```

Synchronization decisions are made exclusively by `RepositoryCoordinator`.

### Article 7 — Dependency Inversion

Application Services depend ONLY on interfaces, never on concrete implementations. Example:

```
StorageService → StorageProvider (interface) → BrowserStorageProvider | AndroidStorageProvider | FutureStorageProvider
```

No service requires modification when replacing an implementation.

### Article 8 — Automatic Synchronization

Users shall NEVER manually select offline mode, online mode, or synchronization. These decisions belong to `ConnectivityService`, `OperationQueue`, and `RepositoryCoordinator`. Synchronization happens automatically.

### Article 9 — No Duplicate Business Logic

Business rules exist in exactly ONE place — the Application Service Layer. They shall never be duplicated inside React components, hooks, routes, dialogs, utilities, repositories, or providers.

### Article 10 — Architecture Integrity

No developer, AI assistant, automation tool, or future contributor may bypass this architecture. Any exception requires explicit architectural approval. Violations are architecture defects.

### Article 11 — Future Native Migration

All browser implementations MUST preserve compatibility with future Android native implementations. Replacing `BrowserStorageProvider` with `AndroidStorageProvider`, or `BrowserCompressionProvider` with `NativeCompressionProvider` (and every other provider), MUST require zero UI modifications.

### Article 12 — Long-Term Maintainability

The architecture shall prioritize: Maintainability, Replaceability, Scalability, Offline reliability, Native performance, Testability, Security, Low coupling, High cohesion. No implementation decision may compromise these principles.

### Article 13 — Backward Compatibility

Architecture improvements must preserve existing functionality unless an approved migration plan exists. Refactoring improves internal implementation without changing approved user-facing behavior. Breaking changes require: documented rationale, migration strategy, and rollback strategy. User experience must remain stable throughout architectural evolution.

### Article 14 — Native-First Product Vision

K-AI Storage Saver is an Android-first storage utility. The React frontend is the **presentation layer**. The Android native layer is the **execution layer**. Future engineering decisions shall prioritize: native performance, offline capability, low battery usage, efficient memory usage, and Android platform integration. Cloud services enhance the application but shall never replace the native capabilities that define the product. The architecture shall always preserve the ability to replace browser providers with Android native providers without requiring UI changes.

---

## Amendment A1 — Compliance Checklist (apply to every change)

Before merging any change, confirm:

- [ ] UI touches only Application Services (no direct Supabase / AI / native / repository imports in `src/components`, `src/routes`, `src/hooks`).
- [ ] New infrastructure sits behind a provider interface.
- [ ] Feature works offline; online paths are additive enhancements.
- [ ] AI calls go through `AIService` → `AIRouter`.
- [ ] Data access goes through a service → `RepositoryCoordinator`.
- [ ] Services depend on interfaces, not concrete classes.
- [ ] No manual online/offline/sync toggles exposed to the user.
- [ ] No business logic duplicated outside the Application Service Layer.
- [ ] Browser provider can be swapped for an Android native provider with zero UI changes.
- [ ] Existing user-facing behavior preserved (or an approved migration plan exists).

## Architecture Technical Debt Register

Track pre-amendment violations here as they are discovered. Do not rewrite them reactively — resolve them during scheduled refactors.

| ID | Location | Violated Article | Planned Resolution |
|----|----------|------------------|--------------------|
| _(none recorded yet — populate as violations are discovered)_ | | | |
