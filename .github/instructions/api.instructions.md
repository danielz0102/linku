---
applyTo: "api/**"
---

# API Guidelines

## Directory Structure

```
apps/api/
├── src/
│   ├── domain/                      # Business Rules
│   │
│   ├── application/                 # Application Business Rules
│   │   ├── use-cases/               # Use case implementations
│   │   └── ports/                   # Interfaces for external dependencies
│   │
│   ├── infrastructure/             # Frameworks & Drivers (External interfaces)
│   │   ├── adapters/                # Concrete implementations of ports
│   │   ├── config/                  # Configuration files
│   │   ├── db/                      # Database setup
│   │   └── dependencies.ts          # Dependency injection container
│   │
│   ├── presentation/                # Interface Adapters
│   │   ├── controllers/             # HTTP request handlers
│   │   │   └── auth-controller.ts
│   │   ├── routers/                 # Route definitions
│   │   │   ├── api-router.ts
│   │   │   └── auth-router.ts
│   │   ├── schemas/                 # Request validation schemas
│   │   │   ├── login-schema.ts
│   │   │   └── register-schema.ts
│   │   ├── middlewares/             # Express middlewares
│   │   │   ├── check-origin.ts
│   │   │   ├── handle-error.ts
│   │   │   ├── handle-not-found.ts
│   │   │   ├── upload-picture.ts
│   │   │   └── validate.ts
│   │   ├── app.ts                   # Express app setup
│   │   └── composition.ts           # Dependency wiring
│   │
│   ├── lib/                         # Shared utilities
│   │
│   ├── __tests__/                   # Integration tests
│   │   ├── login.test.ts
│   │   ├── register.test.ts
│   │   └── lib/                     # Test utilities and mocks
│   │
│   └── index.ts                     # Application entry point
│
└── ...                              # Other configuration files
```
