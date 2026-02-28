# API Contract

This package contains shared TypeScript types for the API contract between the `api` and `web` packages.

## Purpose

The `@linku/api-contract` package centralizes API type definitions to:
- Prevent type duplication between frontend and backend
- Ensure type consistency across the application
- Provide a single source of truth for API contracts

## Types

### LinkuAPI Namespace
- `LinkuAPI.ErrorBody` - Standard error response format
- `LinkuAPI.ErrorCode` - Error code enum
- `LinkuAPI.PublicUser` - User data exposed by the API
- `LinkuAPI.Login` - Login endpoint request/response types
- `LinkuAPI.RegisterUser` - Registration endpoint request/response types
- `LinkuAPI.GetMe` - Current user endpoint request/response types
- `LinkuAPI.UpdateUser` - Update user endpoint request/response types
- `LinkuAPI.Logout` - Logout endpoint request/response types

## Usage

Import types from the package in both `api` and `web`:

```typescript
import type { LinkuAPI } from "@linku/api-contract"

type User = LinkuAPI.PublicUser
type LoginPayload = LinkuAPI.Login["RequestBody"]
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
