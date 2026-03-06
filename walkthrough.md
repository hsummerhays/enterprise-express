# Code Walkthrough: WSL-Native TypeScript Express Backend

This walkthrough explains the core architecture of the Express backend project. The project enforces **Clean Architecture** with constructor-based dependency injection, ensuring the codebase remains maintainable, testable, and decoupled from any specific framework or database.

## 1. Entry Point: `src/server.ts`

This file starts the HTTP server and handles graceful shutdown.

```typescript
const server = app.listen(PORT, () => {
    logger.info({ port: PORT, env: config.app.env }, 'Express server started successfully');
});
```

Environment variables are loaded via the `--env-file` flag at startup rather than a third-party library. On `SIGTERM` or `SIGINT`, the server stops accepting new connections, waits for in-flight requests to finish, then calls `disconnectDatabase()` before exiting. A 10-second safety timer forces an exit if cleanup stalls.

## 2. Express Setup: `src/app.ts`

`app.ts` wires together all middleware and delegates route registration to the bootstrap layer. The middleware is ordered intentionally:

1. **Security first**: `helmet`, `cors` (configurable via `CORS_ORIGIN`), `express-rate-limit`
2. **Request lifecycle**: Request ID generation, Pino-powered structured request logging
3. **Body parsing**: `express.json()` and `express.urlencoded()` (capped at `16kb`)
4. **Routes**: Delegated to `setupRoutes(app)` from the composition root
5. **API docs**: Scalar UI served at `/api-docs`
6. **Error handling**: 404 handler followed by a global error handler

The global error handler distinguishes between operational `DomainError` subclasses (returned with their own `statusCode`) and unexpected errors (logged with full stack, but only exposed in development).

## 3. Clean Architecture

The project follows Clean Architecture, which organizes code into four concentric layers. The fundamental rule is the **Dependency Rule**: source code can only point inward. Outer layers depend on inner layers — never the reverse.

```
          ┌─────────────────────────────┐
          │        Interfaces           │  ← Express, HTTP, routes, validators, OpenAPI
          │  ┌───────────────────────┐  │
          │  │     Infrastructure    │  │  ← SQLite, Argon2, Jose JWT
          │  │  ┌─────────────────┐  │  │
          │  │  │   Application   │  │  │  ← Use cases, DTOs, ports, mappers
          │  │  │  ┌───────────┐  │  │  │
          │  │  │  │  Domain   │  │  │  │  ← Entities, repository interfaces, errors
          │  │  │  └───────────┘  │  │  │
          │  │  └─────────────────┘  │  │
          │  └───────────────────────┘  │
          └─────────────────────────────┘
```

### Directory Structure

```
src/
├── server.ts                         ← HTTP server startup & graceful shutdown
├── app.ts                            ← Express app setup & middleware stack
│
├── bootstrap/
│   ├── container.ts                  ← Composition root: wires all dependencies
│   └── routes.ts                     ← Mounts routes onto the Express app
│
├── domain/                           ← Core business rules (no external dependencies)
│   ├── entities/
│   │   ├── User.ts                   ← passwordHash private; getPasswordHash() accessor
│   │   └── SampleData.ts
│   ├── repositories/                 ← Repository interfaces + SaveUserData type
│   │   ├── UserRepository.ts
│   │   └── SampleDataRepository.ts
│   ├── value-objects/                ← Custom domain value types
│   └── errors/
│       └── DomainError.ts            ← Standalone base + NotFoundError, ValidationError,
│                                         UnauthorizedError, UserAlreadyExistsError, etc.
│
├── application/                      ← Use cases and orchestration (no framework dependencies)
│   ├── dto/                          ← Plain TypeScript types for data flowing between layers
│   ├── mappers/                      ← Converts domain entities to response DTOs
│   ├── ports/                        ← PasswordHasherPort, TokenServicePort, DatabaseHealthPort,
│   │                                     UnitOfWorkPort, LoggerPort
│   └── use-cases/
│       ├── auth/
│       ├── users/
│       ├── sample-data/
│       └── system/
│
├── infrastructure/                   ← External systems (implements domain & application interfaces)
│   ├── database/
│   ├── logging/                      ← PinoLoggerAdapter
│   ├── persistence/                  ← SqliteDatabaseHealthAdapter, SqliteUnitOfWorkAdapter,
│   │                                     InMemory variants
│   ├── repositories/                 ← SQLite and in-memory implementations
│   └── security/                     ← Argon2PasswordHasherAdapter, JoseTokenServiceAdapter
│
├── interfaces/
│   └── http/                         ← Express-specific code isolated here
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── validators/               ← Zod schemas for HTTP request validation
│       └── openapi/                  ← OpenAPI path and schema definitions
│
└── utils/                            ← Shared utilities (logger, config, api-response, etc.)
```

## 4. The Request Lifecycle (Example: Create Sample Data)

A single `POST /sample-data` request traverses every layer. Here is the complete path:

### A. Composition Root (`src/bootstrap/container.ts` + `src/bootstrap/routes.ts`)

Before any request arrives, the composition root wires the entire object graph:

```typescript
// bootstrap/container.ts
const sampleDataRepository = new SqliteSampleDataRepository();
const createSampleDataUseCase = new CreateSampleDataUseCase(sampleDataRepository);
const sampleDataController = new SampleDataController(/* ...use cases */);
container.register(SampleDataController, sampleDataController);
```

The bootstrap router then connects controllers to their routes. Routes are registered via functions — they receive a controller and never import from the container directly:

```typescript
// bootstrap/routes.ts
export function setupRoutes(app: Express): void {
    const sampleDataRouter = Router();
    registerSampleDataRoutes(
        sampleDataRouter,
        container.resolve<SampleDataController>(SampleDataController)
    );
    app.use("/sample-data", sampleDataRouter);
}
```

### B. Route Registration (`src/interfaces/http/routes/sample-data.routes.ts`)

Route files are pure mapping functions. They declare which middleware runs and which controller method handles each endpoint:

```typescript
export function registerSampleDataRoutes(
    router: Router,
    controller: SampleDataController,
): void {
    router.post("/", authenticate, validate(createSampleDataSchema), controller.create);
    router.delete("/:id", authenticate, validate(idParamSchema), controller.remove);
}
```

No business logic. No database calls. No imports from the container.

### C. Validators (`src/interfaces/http/validators/sample-data.validators.ts`)

Zod schemas live in the interfaces layer because they are a transport concern — they validate raw HTTP input. The application layer knows nothing about Zod.

```typescript
export const createSampleDataSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        completed: z.boolean().optional(),
    }),
});
```

The `validate` middleware runs the schema against `{ body, query, params }`. On failure it returns a structured `400` with `ZodError` details — the request never reaches the controller.

### D. Controller (`src/interfaces/http/controllers/sample-data.controller.ts`)

Controllers are deliberately thin. Their only job is to translate HTTP → use case → HTTP response:

```typescript
create = async (req: Request, res: Response): Promise<Response> => {
    const newItem = await this.createSampleDataUseCase.execute(req.body);
    return this.handleSuccess(res, newItem, "Sample data created successfully", 201);
};
```

No business rules. No database calls. No domain logic.

### E. Use Case (`src/application/use-cases/sample-data/CreateSampleData.ts`)

Use cases contain all application logic. They are pure TypeScript classes with no Express, no Zod, no SQLite — just interfaces:

```typescript
export class CreateSampleDataUseCase {
    constructor(private repository: SampleDataRepository) {}

    async execute(request: CreateSampleDataRequest) {
        return this.repository.save({
            title: request.title,
            completed: request.completed ?? false,
        });
    }
}
```

`SampleDataRepository` here is the **interface** from the domain layer — not the SQLite implementation. The use case has no idea how data is actually stored.

### F. Domain Entity & Repository Interface (`src/domain/`)

The domain layer defines the shape of core business objects and the contracts for persisting them:

```typescript
// domain/entities/SampleData.ts
export class SampleData {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly completed: boolean = false,
    ) {}
}

// domain/repositories/SampleDataRepository.ts
export interface SampleDataRepository {
    findAll(): Promise<SampleData[]>;
    findById(id: number): Promise<SampleData | null>;
    save(data: Omit<SampleData, "id">): Promise<SampleData>;
    delete(id: number): Promise<boolean>;
}
```

The domain layer imports nothing from Express, Zod, SQLite, or any other framework. It is the most stable, most testable layer in the system.

### G. Infrastructure Repository (`src/infrastructure/repositories/sample-data.repository.ts`)

The SQLite implementation satisfies the domain interface. When the database changes, only this file changes:

```typescript
export class SqliteSampleDataRepository implements ISampleDataRepository {
    async save(data: Omit<SampleData, "id">): Promise<SampleData> {
        const stmt = db.prepare(
            "INSERT INTO sample_data (title, completed) VALUES (?, ?) RETURNING *"
        );
        const row = stmt.get(data.title, data.completed ? 1 : 0) as Record<string, unknown>;
        return toSampleData(row);
    }
}
```

## 5. Composition Root & Dependency Injection (`src/bootstrap/container.ts`)

The project uses a hand-rolled DI container — a lightweight `Map` keyed by class constructors. This is the **only** place in the codebase where `new` is called on infrastructure classes:

```
Infrastructure (repositories, security)
        ↓ constructor injection
Application (use cases)
        ↓ constructor injection
Interfaces (controllers)
        ↓ registered into container
Bootstrap (routes.ts resolves & mounts)
```

Using the class constructor as the DI token (`container.register(UserController, instance)`) provides type-safe resolution without decorators or a reflection API.

## 6. Ports & Adapters (`src/application/ports/`)

The application layer defines **ports** — interfaces for infrastructure services it depends on but does not own:

```typescript
// application/ports/PasswordHasherPort.ts
export interface PasswordHasher {
    hash(password: string): Promise<string>;
    verify(password: string, hash: string): Promise<boolean>;
}
```

The `LoginUseCase` and `CreateUserUseCase` depend on `PasswordHasher` (the port), not on `Argon2PasswordHasherAdapter` (the adapter). This means use cases can be unit-tested with a mock hasher, and the hashing library can be swapped without changing any application code.

The same pattern applies to all ports: `TokenServicePort`, `DatabaseHealthPort`, `UnitOfWorkPort`, and `LoggerPort` — the application defines the interface, infrastructure provides the implementation, and the container wires them together.

## 7. BaseController (`src/interfaces/http/controllers/base.controller.ts`)

All controllers extend `BaseController`, which provides three standardized response methods:

- **`handleSuccess(res, data, message?, statusCode?)`** — Returns `{ success: true, message, data }` via `ApiResponse.success()`.
- **`handleError(res, message, statusCode?, details?)`** — Returns `{ success: false, message, error }` via `ApiResponse.error()`. Logs 500+ errors automatically.
- **`handleNoContent(res)`** — Returns a `204 No Content` response for successful deletions.

No controller ever calls `res.status().json()` directly. Response formatting is uniform across the entire API.

## 8. Structured Error Handling

The project uses typed error classes rather than raw `Error` objects.

**`src/domain/errors/DomainError.ts`** is the canonical error file and is standalone — it has no external imports. All domain and application errors are defined here:

- **`DomainError`** — Standalone base class with a `statusCode` field. Extends `Error` directly, not `AppError`.
- **`NotFoundError`** — 404 (`"Sample Data not found"`)
- **`ValidationError`** — 400 with structured `details`
- **`UnauthorizedError`** — 401 authentication failures
- **`ForbiddenError`** — 403 authorization failures
- **`UserAlreadyExistsError`** — Domain-specific 400 conflict error

**`src/utils/errors.ts`** provides `AppError`, which extends `DomainError` and adds an `isOperational` flag for distinguishing expected errors from programmer errors. The global error handler in `app.ts` catches all `DomainError` instances (which includes `AppError` and every subclass) and formats them with their `statusCode`.

All errors bubble up to the global error handler. Use cases simply `throw new NotFoundError("Sample Data")` and the framework layer handles the rest.

## 9. Testing

The project uses `Vitest` as the test runner and `Supertest` for integration testing.

**Unit tests** (`tests/unit/application/`) test use cases in complete isolation using `vi.fn()` mocks for all port interfaces. No database, no HTTP server:

```typescript
// tests/unit/application/Login.test.ts
userRepository = { findByEmail: vi.fn(), /* ... */ } as unknown as UserRepository;
passwordHasher = { hash: vi.fn(), verify: vi.fn() } as unknown as PasswordHasher;
loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);
```

**E2E tests** (`tests/e2e/`) spin up the real Express app via Supertest and verify end-to-end API correctness including middleware, validation, authentication, and error responses.

Run them independently with `npm run test:unit` or `npm run test:e2e`.

Test-specific environment variables are provided via `vitest.config.ts`.

## 10. API Documentation (Scalar)

The project auto-generates an interactive API playground using **Scalar / OpenAPI 3.0**.

- **Definitions**: Path and schema definitions live in `src/interfaces/http/openapi/` — one file per domain area (`auth.openapi.ts`, `sample-data.openapi.ts`, etc.). This keeps OpenAPI as an interfaces-layer concern.
- **Registry**: `src/utils/openapi-registry.ts` holds the singleton `OpenAPIRegistry`. The openapi files import it and register their definitions as side effects.
- **Generator**: `src/utils/swagger.ts` imports each openapi module, then runs `OpenApiGeneratorV3` over `registry.definitions` to produce the final spec.
- **Access**: Interactive documentation is available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## 11. Configuration Management (`src/utils/config.ts`)

All environment-based configuration is validated at startup using Zod.

- **Single source**: All config reads from `process.env` (loaded via Node.js `--env-file` flag).
- **Validation**: `config.ts` parses `process.env` against a Zod schema with defaults and coercion (e.g., `PORT` string → number).
- **Fail fast**: The app exits immediately with a descriptive error if any required variable is missing or invalid.
- **No extra libraries**: No `dotenv`, `node-config`, or similar packages — just Zod and `process.env`.

## 12. Logging (Pino)

The project uses **Pino** for high-performance structured JSON logging.

- **Structured output**: Every log entry is a JSON object with `method`, `url`, `statusCode`, `durationMs`, and `requestId` fields.
- **Request tracing**: The `requestId` from the request-id middleware is included in every log entry, enabling full end-to-end request tracing.
- **Dev-friendly**: Uses `pino-pretty` in non-production environments for colorized, readable console output.
- **Production-ready**: Outputs raw JSON in production for direct ingestion by log aggregators (ELK, Datadog, etc.).

## 13. Security

### Rate Limiting (`src/interfaces/http/middleware/rate-limit.middleware.ts`)
- **Global limiter**: 100 requests per 15 minutes per IP, applied to all routes.
- **Auth limiter**: 5 requests per 15 minutes per IP, applied specifically to `POST /auth/login` to prevent brute-force attacks.

### CORS
- Configurable via the `CORS_ORIGIN` environment variable. Defaults to `http://localhost:3000`. Set to your actual domain in production.

### Body Size Limit
- `express.json()` and `express.urlencoded()` capped at `16kb` to prevent large-payload denial-of-service attacks.

## 14. Graceful Shutdown

Handles `SIGTERM` and `SIGINT`. The `gracefulShutdown` function in `src/server.ts` stops accepting connections, waits for in-flight requests to drain, then calls `disconnectDatabase()` from `src/infrastructure/database/sqlite.ts`. A 10-second hard-exit timer prevents stalled cleanup from hanging the process.

## 15. Standardized API Responses (`src/utils/api-response.ts`)

All responses follow a consistent JSON envelope:

- **Success**: `{ success: true, message: "...", data: { ... } }`
- **Error**: `{ success: false, message: "...", error: { code: 400, details: [...] } }`

The `ApiResponse` module is used by `BaseController` and the global error handler — no code in the codebase formats JSON responses directly.

## 16. Bearer Token Authentication

JWT authentication uses **`jose`** — a modern, ESM-native JOSE library.

- **Middleware**: `src/interfaces/http/middleware/auth.middleware.ts` extracts the Bearer token from the `Authorization` header and verifies it with `jwtVerify`. It throws `UnauthorizedError` on failure, which the global error handler catches.
- **Typed payload**: The decoded token is cast to `JwtPayload` from `src/types/auth.types.ts`, providing type-safe access to `id`, `email`, and `role`.
- **Password hashing**: `Argon2PasswordHasher` in `src/infrastructure/security/` uses `argon2` (OWASP-recommended) for password verification. The application layer depends only on the `PasswordHasher` port interface.
- **Token signing**: `JoseTokenService` in `src/infrastructure/security/` implements the `TokenService` port. The `LoginUseCase` calls `tokenService.sign()` without knowing the JWT library.
- **Secret management**: Controlled via the `JWT_SECRET` environment variable.

## 17. Request Tracing

Every request is assigned a unique ID via `src/interfaces/http/middleware/request-id.middleware.ts`.

- **Header**: `X-Request-Id` is set on every response.
- **Client-provided**: If the client sends an `X-Request-Id` header it is preserved; otherwise a UUID is generated.
- **Structured logging**: The ID is attached to every Pino log entry, enabling complete request tracing through the system.
- **Available in locals**: Accessible via `res.locals.requestId` throughout the request lifecycle.
