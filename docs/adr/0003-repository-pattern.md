# ADR-0003: Repository Pattern with Interface Contracts

## Status
**Accepted** — 2026-03-05

## Context
Data access in Express applications is often scattered — raw SQL queries inside route handlers, ORM calls inside controllers, or database-specific logic leaking into services. This makes it difficult to:

1. **Swap databases** without rewriting business logic.
2. **Unit test services** without standing up a real database.
3. **Enforce consistent data access patterns** across the team.

## Decision
We adopted the **Repository Pattern** with explicit interface contracts:

1. **Interfaces** are defined in the Application layer (`src/application/contracts/`).
2. **Implementations** live in the Infrastructure layer (`src/infrastructure/repositories/`).
3. **Services** depend only on the interface, never on the concrete implementation.

```
src/application/contracts/
├── user.repository.interface.ts        ← IUserRepository
└── sample-data.repository.interface.ts ← ISampleDataRepository

src/infrastructure/repositories/
├── user.repository.ts                  ← UserRepository implements IUserRepository
└── sample-data.repository.ts           ← SampleDataRepository implements ISampleDataRepository
```

### Interface Example

```typescript
// src/application/contracts/user.repository.interface.ts
export interface IUserRepository {
    create(data: CreateUserDTO): Promise<UserEntity>;
    findById(id: number): Promise<UserEntity | undefined>;
    findAll(): Promise<UserEntity[]>;
    delete(id: number): Promise<boolean>;
}
```

### Service Example

```typescript
// src/application/services/user.service.ts
export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async createUser(data: CreateUserDTO): Promise<UserEntity> {
        return this.userRepository.create(data);
    }
}
```

The service has no idea whether the repository uses SQLite, PostgreSQL, MongoDB, or an in-memory array. It only knows the contract.

### Dependency Injection
The DI container (`src/container/container.ts`) wires concrete implementations to their interfaces at bootstrap time. Routes resolve fully-assembled controllers from the container.

## Consequences

### Positive
- **Database-agnostic services** — Migrating from SQLite to PostgreSQL requires only a new repository implementation and a one-line change in the container.
- **Testable** — Services can be unit-tested with mock repositories that implement the same interface.
- **Consistent API** — Every repository follows the same CRUD contract (`findAll`, `findById`, `create`, `delete`), making the codebase predictable.
- **Error translation** — Repositories catch infrastructure-specific errors (e.g., SQLite `UNIQUE` constraint violations) and throw domain-appropriate errors (`ValidationError`).

### Negative
- **Boilerplate** — Each new entity requires an interface file, an implementation file, and container registration.
- **Over-abstraction risk** — For a small application, the indirection may feel unnecessary.

### Mitigations
- The pattern pays for itself as soon as you add a second database, write your first unit test, or onboard a new developer.
- The DI container keeps wiring centralized and predictable.

## References
- Martin Fowler, [*Repository Pattern*](https://martinfowler.com/eaaCatalog/repository.html)
- Robert C. Martin, *Clean Architecture* — Chapter 22: The Clean Architecture
