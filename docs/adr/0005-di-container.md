# ADR-0005: Lightweight DI Container over Manual Wiring

## Status
**Accepted** — 2026-03-06

## Context
The initial implementation used manual constructor injection inside each route file:

```typescript
// src/interfaces/routes/user.routes.ts (before)
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
```

This worked well for three features, but introduced problems at scale:

1. **Duplication** — The same wiring pattern was repeated in every route file.
2. **No single source of truth** — If a service gained a new dependency, every route file that used it needed updating.
3. **Testing friction** — Swapping implementations for tests required modifying route-level code.

We considered full-featured DI frameworks (Inversify, tsyringe, TypeDI) but rejected them because:
- They require `reflect-metadata` and experimental decorators.
- They add significant bundle size and complexity.
- They conflict with our ESM-first, decorator-free approach.

## Decision
We implemented a **lightweight DI container** (`src/container/container.ts`) that acts as the application's **Composition Root**:

```typescript
class DIContainer {
    private dependencies = new Map<any, any>();

    register<T>(token: any, instance: T): void {
        this.dependencies.set(token, instance);
    }

    resolve<T>(token: any): T {
        const instance = this.dependencies.get(token);
        if (!instance) throw new Error(`Dependency '${name}' not found`);
        return instance as T;
    }
}
```

All dependencies are bootstrapped in a single file, wired bottom-up:

```typescript
// Infrastructure
container.register(UserRepository, new UserRepository());

// Application
container.register(UserService, new UserService(container.resolve(UserRepository)));

// Interfaces
container.register(UserController, new UserController(container.resolve(UserService)));
```

Routes then resolve fully-assembled controllers:

```typescript
const userController = container.resolve<UserController>(UserController);
```

## Consequences

### Positive
- **Centralized wiring** — All dependency relationships are visible in one file.
- **No decorators** — Works with plain classes and constructors. No `reflect-metadata`.
- **Zero dependencies** — The container is ~20 lines of code with no npm packages.
- **Easy to test** — Register mock implementations in test setup.
- **Predictable** — Uses class constructors as tokens. No string-based or symbol-based magic.

### Negative
- **No auto-resolution** — Dependencies must be explicitly registered in order. The container does not inspect constructor signatures.
- **Runtime errors** — Attempting to resolve an unregistered dependency throws at startup rather than being caught at compile time.

### Mitigations
- The bootstrap runs at import time, so missing registrations fail immediately on server start — not at request time.
- If the project outgrows this pattern, migrating to Inversify or tsyringe is straightforward since the constructor injection signatures are already in place.

## References
- Mark Seemann, *Dependency Injection in .NET* — Chapter 3: Composition Root
- [Composition Root pattern](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)
