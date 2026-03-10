---
name: General Guidelines
description: General guidelines for writing code in Linku.
---

# Linku

Linku is a messaging app. The codebase is a monorepo with the following packages:

- `api`: Backend API.
- `web`: Web application.
- `e2e`: End-to-end tests.
- `@linku/api-contract`: Shared types between the backend and frontend.

Check the requirements of the project [here](../docs/linku.md).

## General Guidelines

- Use kebab-case for file names.
- Use `pnpm test` in the project you are to run tests.
