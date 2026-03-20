---
applyTo: "apps/web/**"
description: "Use when editing the web SPA in apps/web. Enforces feature-first architecture, file structure, and import boundaries."
---

# Web App Architecture Instructions

Use this instruction before editing `apps/web/src`.

## Package Map

```txt
apps/web/src
├─ app              # App shell, router, and top-level composition
├─ sections         # Feature modules (auth, profile, users, home)
├─ ui               # Reusable presentation components
├─ shared           # Cross-feature shared code (context, components, hooks, utils)
├─ api              # HTTP client and API error normalization
├─ lib              # Shared utilities
├─ env.ts           # Frontend environment access
└─ main.tsx         # Browser entrypoint
```

## Directory Responsibilities

- `app`: Compose providers, router, and app-level pages only. Do not place feature-specific business logic here.
- `sections/<feature>`: Keep feature UI and logic together (pages, components, hooks, and services).
- `ui/components`: Generic reusable UI only. Components must stay presentation-focused.
- `shared`: Cross-feature code that is reused by multiple sections. This includes shared context and other reusable modules that are not pure UI.
- `api`: Shared API client setup and cross-feature error handling.
- `lib`: Small pure utilities with no feature knowledge.

## File Structure Conventions

- Use kebab-case file names.
- Keep feature services inside their owning feature, usually under `sections/<feature>/services`.
- Keep feature-only components inside `sections/<feature>/components`.
- Keep reusable cross-feature components in `ui/components`.
- Place page-level feature entries in `sections/<feature>` (for example `login.tsx`, `search-users.tsx`).

## Testing Placement

- Keep unit tests colocated in `src` near the implementation they validate (for example feature-local `tests` folders or `*.test.ts(x)` files).
- Use `apps/web/tests` for integration tests if they are introduced later.
- Avoid importing test-only helpers into runtime source files.

## Guardrails

- Preserve feature isolation and avoid section-to-section coupling.
- Keep reusable layers (`ui`, `lib`) free of feature and app-level dependencies.
- Prefer local feature changes over cross-cutting refactors unless the task explicitly requires shared extraction.
