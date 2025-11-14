# Architecture

## Overview

This application follows a **monorepo architecture** with clear separation between frontend, backend, and core business logic. The system is designed to support real-time messaging capabilities while maintaining clean boundaries between concerns.

## High-Level Architecture

```
linku/
├── packages/
│   ├── frontend/          # Client-side application
│   ├── backend/           # Server-side application
│   └── core/              # Core business logic, utilities, and type definitions
└── docs/                  # Project documentation
```

## Package Responsibilities

### Frontend Package

**Purpose**: User interface and client-side application logic

**Responsibilities**:

- Render UI components and manage user interactions
- Handle client-side routing and navigation
- Manage application state (user sessions, conversations, UI state)
- Communicate with backend via REST API and WebSocket connections
- Display real-time updates (messages, online status, notifications)

**Key Characteristics**:

- Thin layer - delegates business logic to core package
- Consumes types and utilities from `core` package for validation and formatting

---

### Backend Package

**Purpose**: Server-side application and API layer

**Responsibilities**:

- Expose REST API endpoints for CRUD operations
- Handle WebSocket connections for real-time communication
- Manage authentication and authorization
- Orchestrate business logic from `core` package
- Interface with database and external services
- Handle file uploads and media processing

**Key Characteristics**:

- Thin orchestration layer - core business logic lives in `core`
- Enforces security and access control
- Manages infrastructure concerns (database, caching, logging)

---

### Core Package

**Purpose**: Core business logic, domain models, and shared type definitions

**Responsibilities**:

- Define TypeScript type definitions and interfaces
- Define business rules and validation logic
- Implement domain operations (message handling, user management, friend logic)
- Provide reusable utilities (date formatting, text sanitization, validation)
- Define business constants and configurations
- Implement algorithms (message encryption, search, filtering)
- Define data models (User, Message, Conversation, Group)

**Key Characteristics**:

- **Framework-agnostic**: No dependencies on Express, React, or other UI/server frameworks
- **Pure business logic**: Focused on "what" not "how"
- **Testable**: Easy to unit test without infrastructure concerns
- **Reusable**: Can be used by both frontend and backend

**Examples of Core Logic**:

- Message validation (length, content filtering)
- Username validation rules
- Friend request state transitions
- Conversation grouping logic
- Date/time formatting helpers
- Text sanitization and emoji handling

---

## Communication Patterns

### REST API Communication

- Used for stateless operations (CRUD, authentication, data fetching)
- Frontend makes HTTP requests to backend endpoints
- Backend validates requests, uses `core` logic, returns responses

### WebSocket Communication

- Used for real-time bi-directional communication
- Events: message sent/received, user online/offline, typing indicators
- Both frontend and backend handle events using `core` business logic

### Cross-Package Dependencies

```
frontend  ──────┐
                ├──→  core  ←── Used for business logic, utilities, and types
backend   ──────┘
```

**Dependency Rules**:

- `frontend` depends on: `core`
- `backend` depends on: `core`
- `core` has no dependencies

---

## Design Principles

### 1. Separation of Concerns

- **Presentation** (frontend): UI and user interaction
- **Orchestration** (backend): API, infrastructure, security
- **Business Logic & Data Models** (shared): Domain rules, operations, and type definitions

### 2. DRY (Don't Repeat Yourself)

- Business logic is written once in `core` package
- Both frontend and backend reuse the same validation and business rules
- Reduces bugs and ensures consistency

### 3. Maintainability

- Changes to business logic only require updates in `core` package
- Frontend and backend remain thin orchestration layers
- Clear boundaries make testing and debugging easier

### 4. Scalability

- Monorepo structure allows independent deployment if needed later
- Core package can be extracted to a separate library if the app grows
- Clean architecture supports future microservices migration

---

## Technology Approach

### Frontend

- Single Page Application (SPA) framework
- WebSocket client for real-time features
- HTTP client for REST API communication

### Backend

- RESTful API server
- WebSocket server for real-time messaging
- Database integration
- Authentication and authorization

### Core

- Pure JavaScript/TypeScript modules
- No framework dependencies
- Comprehensive unit test coverage

---

## Development Workflow

1. **Define Types & Business Logic**: Start by defining interfaces and domain logic in `core` package
2. **Backend Implementation**: Create API endpoints that use `core` logic
3. **Frontend Implementation**: Build UI components that use `core` logic
4. **Integration**: Connect frontend and backend via REST and WebSocket

---

## Benefits of This Architecture

✅ **Consistency**: Same business rules on client and server  
✅ **Testability**: Pure logic is easy to test in isolation  
✅ **Reusability**: Shared code reduces duplication  
✅ **Type Safety**: Shared types prevent API mismatches  
✅ **Maintainability**: Clear boundaries and single responsibility  
✅ **Learning**: Demonstrates real-world software architecture patterns

---

## Next Steps

See individual package documentation for implementation details:

- `packages/frontend/README.md` - Frontend implementation guide
- `packages/backend/README.md` - Backend implementation guide
- `packages/core/README.md` - Business logic and type definitions documentation
