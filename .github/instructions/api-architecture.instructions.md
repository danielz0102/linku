---
applyTo: "apps/api/**"
description: "API package architecture boundaries, responsibilities, and import rules"
---

# API Package Instructions

Use this instruction as an architectural reference before editing `apps/api`.

## Package Map

```txt
apps/api
├─ src
│  ├─ core      # Domain and use-case logic
│  ├─ api       # HTTP modules, routers, adapters, middleware wiring
│  ├─ server    # Runtime/bootstrap to start the app
│  └─ env.ts    # Environment variables access
└─ tests        # Integration tests and shared test helpers
```

## Directory Responsibilities

- `src/core`: Business logic boundary. Must not import from outside `src/core`.
- `src/api`: Feature modules and routers. Modules export routers and wire endpoints.
- `src/server`: Application runtime and startup code. Imports the API router.
- `src/env.ts`: Centralized environment variable access.
- `tests`: Integration tests and test helpers only. Unit tests are colocated with source modules.

## Dependency Rules

- `src/core`: Cannot import anything from outside `src/core`.
- `src/api`: May import from `src/core`, `src/api/shared`, and `src/env.ts`.
- `src/server`: May import from `src/api` and runtime dependencies.
- `tests`: May import app code for testing.
- Forbidden: Any import from `src/core` to `src/api`, `src/server`, `src/env.ts`, or `tests`.

If a change seems to require a forbidden import, refactor boundaries instead of bypassing this rule.

## Navigation Hints

- Endpoint wiring: `src/api/**/**-router.ts` and `src/api/**/endpoints`.
- Business logic: `src/core/use-cases` and related ports/dtos.
- Runtime startup: `src/server`.
- Integration tests: `tests`.
- Unit tests: Next to the source module under test.

## Guardrails

- Preserve directory boundaries and import directions.
- Explicitly report architecture violations (existing or newly introduced).
- Keep unit tests colocated with the source they validate.
- Keep routers exported from each API module.
- Prefer small, local changes in the correct layer over cross-layer shortcuts.
