# ADR-0001: Clean Architecture

## Status
**Accepted** — 2026-03-05

## Context
We needed an architectural foundation for a reference-grade Express.js backend that would remain maintainable, testable, and framework-independent as the codebase scales.

Common Express projects grow organically — routes call database queries directly, business logic leaks into controllers, and swapping infrastructure (e.g., changing from PostgreSQL to MongoDB) requires rewriting large portions of the application.

## Decision
We adopted **Clean Architecture** as defined by Robert C. Martin, organizing the codebase into four concentric layers with a strict dependency rule:

```
Domain → Application → Interfaces → Infrastructure
```

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| **Domain** | `src/domain/` | Entities, value objects, Zod schemas, and business rules |
| **Application** | `src/application/` | Use cases, services, and repository interface contracts |
| **Interfaces** | `src/interfaces/` | Controllers, routes, middleware, and DTOs |
| **Infrastructure** | `src/infrastructure/` | Database connections, repository implementations, and external services |

**The Dependency Rule:** Source code dependencies always point inward. Infrastructure depends on Interfaces, Interfaces depends on Application, Application depends on Domain. Domain depends on nothing.

## Consequences

### Positive
- **Framework independence** — Express, Pino, and SQLite are isolated in the outer layers. The core business logic has zero framework imports.
- **Testability** — Services can be unit-tested with mock repositories. No HTTP server needed.
- **Replaceability** — Swapping Express for Fastify, or SQLite for PostgreSQL, only requires changes to the Infrastructure and Interfaces layers.
- **Onboarding** — New developers can reason about the system by understanding which layer they are working in.

### Negative
- **More files** — A simple CRUD feature requires a schema, service, controller, repository interface, repository implementation, and route file.
- **Indirection** — Request flow traverses multiple layers, which can feel heavy for trivial operations.

### Mitigations
- The DI container (`src/container/container.ts`) centralizes wiring, so adding a new feature follows a predictable pattern.
- The folder structure is self-documenting — each layer's purpose is obvious from its name.

## References
- Robert C. Martin, *Clean Architecture* (2017)
- [The Clean Architecture (blog post)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
