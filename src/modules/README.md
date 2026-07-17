# K-Ai Modular Architecture (Offline-First + Cloud-Enhanced)

> This directory is an **internal engineering refactor**. It does NOT touch
> the UI, routes, components, branding, or design system. The existing
> `src/routes/`, `src/components/`, and `src/services/index.ts` remain the
> approved presentation layer.

## Three Layers

```
Layer 1  Presentation Layer     src/routes, src/components  (UNCHANGED)
              │
              ▼
Layer 2  Application Services   src/modules/*/service.ts
              │
              ▼
Layer 3  Native + Cloud         src/modules/*/providers/{local,cloud}.ts
```

Rules:
- The UI never imports from `providers/` directly.
- The UI never imports Supabase directly (goes through a module service).
- Every module exposes a single `service.ts` facade.
- Every feature has an **Offline** capability and an **Online Enhancement**.

## Modules

| Module          | Offline capability                  | Online enhancement                 |
|-----------------|-------------------------------------|------------------------------------|
| `storage`       | Device scan, breakdown, largest     | AI insights, predictive trends     |
| `duplicates`    | Hash + filename dedupe              | AI near-duplicate detection        |
| `compression`   | Image/video/audio/PDF/ZIP           | AI codec + quality prediction      |
| `vault`         | AES + PIN + biometrics              | Optional cloud backup + sync       |
| `cleanup`       | Junk, cache, empty, temp            | AI usage-based suggestions         |
| `reports`       | Local history                       | Multi-device sync                  |
| `ai`            | Local heuristics                    | Cloud LLM (via `AIRouter`)         |
| `settings`      | Local prefs                         | Cross-device settings sync         |
| `auth`          | Cached session / anonymous          | Supabase Auth                      |
| `sync`          | Queue offline mutations             | Drain queue when online            |
| `notifications` | Local scheduled notifications       | Push notifications                 |

## Cross-cutting

- `core/connectivity.ts` — single source of truth for online/offline state.
- `core/repository.ts` — `RepositoryCoordinator` merges Local + Cloud repos.
- `core/queue.ts` — pending-operation queue drained on reconnect.
- `ai/router.ts` — `AIRouter` picks Local vs Cloud AI provider transparently.

## Engineering rules (enforced)

1. Every feature works offline before online is added.
2. Cloud features never break offline paths.
3. Local DB is the source of truth while offline.
4. Sync runs automatically on reconnect.
5. No manual online/offline switch surfaced to the user.
6. Offline mutations are queued and replayed.
