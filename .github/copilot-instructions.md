---
applyTo: "**"
description: "Linku monorepo structure, naming, and workflow rules"
---

# Linku Workspace Instructions

## Project Context

- Linku is an instant messaging app.
- Product requirements are documented in `docs/linku.md`.

## Monorepo Structure

- The repository is a `pnpm` workspace.
- Top-level directories:
  - `apps/`: Main application code.
  - `packages/`: Shared libraries and utilities.
  - `docs/`: Documentation and requirements.

## App and Package Map

- `apps/api`: API server for the frontend app.
- `apps/web`: Frontend SPA.
- `apps/e2e`: End-to-end tests.
- `packages/api-contract`: TypeScript API request/response types.

## Conventions

- Use kebab-case for file names.

## Tooling Guidance

- When investigating behavior of a specific library or framework, use Context7 MCP.

## Commands

- Run tests from the target package directory with `pnpm test`.
