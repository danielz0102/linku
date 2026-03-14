# Linku

Linku is an instant messaging app. Check the requirements of the project [here](./docs/linku.md).

## Architecture

The codebase is structured as a monorepo using `pnpm` workspaces. The main folders are:

```
linku/
├── apps/ # main application code
├── packages/ # shared libraries and utilities
└── docs/ # documentation and requirements
```

### Apps

- `api/`: API server for the frontend app.
- `web/`: Frontend SPA.
- `e2e/`: End-to-end tests.

### Packages

- `@linku/api-contract/`: TypeScript types of API requests and responses.

## General Guidelines

- Use kebab-case for file names.
- Use Context7 MCP when you need to investigate anything about a specific library or framework.

## Commands

- Use `pnpm test` in the package you are to run tests.
