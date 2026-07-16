# K-Ai Storage Saver — Engineering Constitution

**Version:** 1.0 Revision A
**Status:** HIGHEST AUTHORITY

> If any future instruction conflicts with this document, **this document wins.**

> **Revision A** integrates on-device AI assistance into the constitution. Every prior section has been reviewed for conflicts with intelligent AI features and updated in place. There is one — and only one — consistent specification.

---

## Mission

- Recover Storage Safely.
- Protect Memories.
- Provide intelligent on-device recommendations that help users make better storage decisions.

Every engineering decision must reinforce these three promises.

## Vision

Build the most trusted AI-assisted Android storage recovery application. **Trust is the primary product feature.** Intelligence must always increase — never reduce — that trust.

## Product Philosophy

K-Ai Storage Saver is an AI-assisted storage management application.

- Protecting memories > recovering storage.
- Reliability > speed.
- Simplicity > feature count.
- Honesty > marketing.
- AI supports the user. AI never replaces the user. Users always remain in control.

## AI Philosophy

Artificial Intelligence exists to **assist** — not automate, not replace, not confuse.

AI shall: Explain · Recommend · Predict · Prioritize · Optimize.

AI shall **never** perform destructive actions without explicit user approval.

## Version 1 Principles

Version 1 is intentionally focused. Every feature must directly support storage recovery, memory protection, or intelligent on-device assistance. Do not add functionality outside approved scope.

## Engineering Values

Safety First · Privacy First · Offline First · Accessibility First · Maintainability First · Transparency First · **AI-Assisted, User-Controlled**.

## User Experience

Every interaction must be: Simple · Predictable · Friendly · Professional · Reassuring.

Users should never wonder: *What happened? Why? What happens next?* AI explanations exist to answer those questions in plain language.

## Data Safety

- Never overwrite original files directly.
- Always verify compressed media.
- Always support restoration whenever technically possible.
- AI may recommend, prioritize, or estimate — never delete, compress, or move files on its own.
- Never risk user memories.

## Safe Vault

Foundation of user trust. Every workflow must preserve original media until successful completion. AI may explain retention, restore impact, vault health, and integrity. **AI shall never permanently delete media.** Never bypass Safe Vault rules.

## Undo

Available whenever technically possible. If unavailable, explain why.

## Offline

Version 1 operates completely offline. No cloud dependency, no remote processing, no hidden synchronization. **All AI inference runs on-device.** No cloud AI. No online inference. No remote machine learning. No uploading photos, videos, or metadata — ever.

## Privacy

No accounts. No login. No registration. No advertising. No analytics. No hidden tracking. User media never leaves the device. AI processing occurs entirely on the device, with the same guarantees as every other subsystem.

## Architecture

Clean Architecture · MVVM · Repository Pattern · Dependency Injection · Operation Coordinator · Service Interfaces · Room Database · Jetpack Compose · Material Design 3 · **On-Device AI Engines** (see Implementation).

## Android

Respect MediaStore, Scoped Storage, WorkManager, Foreground Services, and modern Android APIs. Avoid deprecated APIs. On-device AI uses standard Android ML runtimes (e.g. TensorFlow Lite / NNAPI / MediaPipe) with bundled models — no runtime downloads.

## User Interface

Material Design 3. Consistent spacing, typography, animations, navigation. No visual clutter. The Home Dashboard surfaces **exactly one** intelligent recommendation at a time. Recommendations must always be Relevant · Actionable · Transparent — never overwhelming.

## AI Features (Version 1)

### AI Storage Advisor
Analyzes storage usage, media categories, large files, recently added media, and storage trends. Produces recommendations such as: *Compress WhatsApp videos · Compress large videos · Archive old media · Review downloads · Avoid compressing already optimized media.*

### AI Compression Advisor
Before compression, estimates recoverable space, expected quality, compression time, expected storage savings, and confidence level. Recommends High Quality · Balanced · Maximum Space Saving, and explains why.

### AI Storage Health
Replaces generic storage scores with intelligent summaries, e.g. *Storage is healthy · Videos are consuming most of your storage · Photos are already optimized · Large videos offer the greatest recovery potential.*

### AI Smart Insights
Automatically detects WhatsApp videos, camera videos, screenshots, downloads, large media, old media, frequently duplicated folders, and unused archives. Presents them as actionable recommendations.

### AI Job Assistant
Translates technical failures into friendly language. Example: instead of *"Compression Failed"*, explain *"This file is currently being used by another application. Close the application and try again."*

### AI Recovery Advisor
When restoring media, explains what will be restored, storage impact, Safe Vault status, and potential conflicts.

## AI Recommendation Engine

The Home Dashboard shows only ONE recommendation at a time. Every recommendation includes **Accept · Dismiss · Learn More**.

## AI Decision Engine

AI **may** recommend, prioritize, and estimate.

AI **shall NEVER** delete files automatically, compress automatically, move files automatically, or override user decisions.

## User Control

Users may disable AI recommendations in Settings, reset recommendation history, and continue using every non-AI feature. No AI feature ever requires internet.

## Performance

Never block the UI thread. Use background processing. Support large media libraries. Recover gracefully from interruptions. On-device inference runs off the UI thread and degrades gracefully on lower-tier devices.

## Security

Protect user data. Request minimum permissions. Explain every permission. Never expose technical details. **AI shall never access external servers. No cloud AI. No online inference. No user tracking. No advertising profile.**

## Quality

No placeholder screens. No unfinished workflows. No fake progress. No fake scanning. **No fake AI** — every AI output is produced by a real on-device engine or clearly labeled unavailable. No misleading storage estimates.

## Honesty

Never exaggerate compression, storage savings, recovery, performance, or AI capability. Always present realistic expectations. AI must communicate confidence and uncertainty honestly.

## Testing

Every feature must be tested. Every workflow must be verified. Every AI engine must be tested for correctness, offline operation, and graceful failure. Critical bugs block release.

## Google Play

Comply with current Google Play policies. Maintain accurate Data Safety disclosures. Maintain an accurate Privacy Policy.

The application is marketed as: *On-device intelligent storage recommendations · AI-assisted storage optimization · Privacy-first AI.*

Do **NOT** market as: Generative AI · ChatGPT · Large Language Model · Cloud AI.

## Implementation

The following on-device engines are required and live behind service interfaces (see `src/services/index.ts`):

- `AIRecommendationService`
- `StorageAnalysisEngine`
- `CompressionPredictionEngine`
- `HealthInsightEngine`
- `RecommendationRepository`

All operate entirely on-device.

## Future Features (NOT v1)

Encrypted Safe Vault · Cloud Backup · Duplicate Detection (automated) · Generative AI Recommendations · Password Protection.

## Change Management

Every proposed change must answer:

1. Does it improve user trust?
2. Does it simplify the product?
3. Does it protect user memories?
4. Does it support the mission (recover, protect, assist)?
5. Does it preserve on-device privacy?

If any answer is "No", do not implement it.

## Design Freeze

After Release Candidate 1, only changes related to Critical Bugs · Security · Accessibility · Google Play Compliance · Performance · AI correctness are permitted. New features are prohibited.

## Success Definition

K-Ai Storage Saver succeeds when users say: *"I trust this app with my photos, and its suggestions actually help."*

That is more important than download count, revenue, or feature count.

## Final Rule

Whenever uncertainty exists, choose the option that:

- Protects user memories.
- Improves user trust.
- Keeps the application simple.
- Improves long-term maintainability.
- Keeps intelligence on-device and under user control.

## Do Not Deviate

This Engineering Constitution is permanent. It governs all future development. No implementation may violate these principles without a deliberate architectural review.

## Final Acceptance Criteria

Version 1 is complete only when:

- The application is stable.
- Original media is protected.
- Compression is reliable.
- Safe Vault works correctly.
- Undo works where supported.
- The UI is polished.
- Accessibility is supported.
- Privacy commitments are honored.
- All AI runs on-device and honors the AI Decision Engine rules.
- Google Play requirements are met.
- The application delivers a premium, AI-assisted Android experience.

---

**Recover Storage Safely. Protect Memories. Assist Intelligently.**
