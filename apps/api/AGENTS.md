# API Package Reference (for agents)

## Purpose

Use this file as a quick architectural reference before editing `apps/api`.
It defines what each top-level directory is for and which import directions are allowed.

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

## Dependency Rules (Allowed Imports)

- `src/core` -> cannot import anything from outside `src/core`.
- `src/api` -> may import from `src/core`, `src/api/shared`, and `src/env.ts`.
- `src/server` -> may import from `src/api` (router wiring) and runtime dependencies.
- `tests` -> may import app code for testing.
- Forbidden: any import from `src/core` to `src/api`, `src/server`, `src/env.ts`, or `tests`.

Agent check: if your change needs a forbidden import, refactor boundaries instead of bypassing this rule.

## Fast Navigation Hints

- Endpoint wiring: start in `src/api/**/**-router.ts` and `src/api/**/endpoints`.
- Business logic: start in `src/core/use-cases` and related ports/dtos.
- Runtime/middleware startup: start in `src/server`.
- Integration tests: start in `tests`.
- Unit tests: look next to the module under test.

## Guardrails

- Preserve directory boundaries and import directions.
- If you notice any architecture violation (existing or newly introduced), report it explicitly.
- Keep unit tests colocated with the source they validate.
- Keep routers exported from each API module.
- Prefer small, local changes in the correct layer over cross-layer shortcuts.
