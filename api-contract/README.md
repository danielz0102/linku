# API Contract

This package contains shared TypeScript types for the API contract between the `api` and `web` packages.

## Purpose

The `@linku/api-contract` package centralizes API type definitions to:
- Prevent type duplication between frontend and backend
- Ensure type consistency across the application
- Provide a single source of truth for API contracts

## Types

### Error Types
- `ErrorBody<T>` - Standard error response format
- `ErrorCode` - Error code enum

### User Types
- `PublicUser` - User data exposed by the API

### Registration Types
- `RegistrationBody` - User registration request body
- `RegistrationErrorBody` - Typed error response for registration

## Usage

Import types from the package in both `api` and `web`:

```typescript
import type { ErrorBody, PublicUser, RegistrationBody } from "@linku/api-contract"
```

## Development

Build the package:
```bash
pnpm run build
```

Lint the code:
```bash
pnpm run lint
```

Format the code:
```bash
pnpm run format
```
