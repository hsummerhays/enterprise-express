# Code Walkthrough: WSL-Native TypeScript Express Backend

This walkthrough explains the core architecture of the Express backend project. The project enforces a strict layered architecture with constructor-based dependency injection, ensuring the codebase remains maintainable, testable, and robust.

## 1. Entry Point: `src/server.ts`

This file is responsible for initializing the environment and igniting the HTTP server. 

```typescript
import app from './app.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

const PORT = config.app.port;

app.listen(PORT, () => {
    logger.info('Express server successfully ready', {
        port: PORT,
        env: config.app.env,
    });
});
```

Because this project is configured for Node v24+, environment variables are loaded directly via the `--env-file` flag when executing the startup script, rather than relying on an external library.

## 2. Express Setup: `src/app.ts`

The `app.ts` file handles all top-level Express routing, security middleware, rate limiting, and global error handling. The middleware is ordered intentionally:

1. **Security first**: `helmet`, `cors` (with configurable `CORS_ORIGIN`), `express-rate-limit`
2. **Request lifecycle**: Request ID generation, Pino-powered structured request logging
3. **Body parsing**: `express.json()` and `express.urlencoded()` (capped at `16kb`)
4. **Routes**: Health, auth, and sample data endpoints
5. **Error handling**: 404 handler using `AppError`, global error handler with structured responses

The global error handler distinguishes between operational errors (`AppError` subclasses) and unexpected errors, only exposing stack traces in development.

## 3. Layered Architecture

The project enforces a strict data flow through four layers:

```
Routes → Controllers → Services → Repositories
```

Each layer has a single responsibility:

- **Routes** map HTTP verbs/paths to Controller methods and apply middleware (validation, authentication, rate limiting).
- **Controllers** extend `BaseController`, parse request input, call Services, and serialize responses using `handleSuccess`, `handleError`, or `handleNoContent`.
- **Services** contain all business logic. They are framework-agnostic and do not know about Express `req` or `res` objects.
- **Repositories** encapsulate all data access operations (in-memory arrays, database queries, etc.).

Dependencies flow downward via constructor injection: Routes instantiate Repositories → pass them to Services → pass Services to Controllers.

## 4. The Request Lifecycle (Example: Sample Data)

When an HTTP request enters the system, it typically traverses through the following layers:

### A. Routes (`src/routes/sample-data.routes.ts`)
Routes map HTTP endpoints to controller methods. Dependencies are wired via manual constructor injection at the route level:

```typescript
const sampleDataRepository = new SampleDataRepository();
const sampleDataService = new SampleDataService(sampleDataRepository);
const sampleDataController = new SampleDataController(sampleDataService);

router.post('/', authenticate, validate(createSampleDataSchema), sampleDataController.create);
```

### B. Validation Middlewares & Schemas (`src/schemas/` & `src/middleware/`)
The `validate` middleware executes a given Zod schema against the incoming request. If the payload is invalid, the middleware intercepts the request and returns a structured `400 Bad Request` containing the specific `ZodError` issues before it ever reaches the controller.

The middleware accepts any `ZodTypeAny` schema, making it flexible enough for objects, unions, and intersections.

### C. Controllers (`src/controllers/sample-data.controller.ts`)
Controllers extend `BaseController` and receive their dependencies through their **constructor**. All response formatting is handled via inherited helper methods:

```typescript
export class SampleDataController extends BaseController {
    constructor(private sampleDataService: SampleDataService) {
        super();
    }

    create = async (req: Request, res: Response) => {
        const { title, completed } = req.body;
        const newItem = await this.sampleDataService.create({ title, completed });
        return this.handleSuccess(res, newItem, "Sample data created successfully", 201);
    };
}
```

### D. Services (`src/services/sample-data.service.ts`)
Services receive repositories via constructor injection and contain business logic:

```typescript
export class SampleDataService {
    constructor(private readonly repository: SampleDataRepository) {}

    async create(data: CreateSampleDataRequest): Promise<SampleData> {
        return this.repository.create(data);
    }
}
```

### E. Repositories (`src/repositories/sample-data.repository.ts`)
Repositories encapsulate all data access. When a real database is added, only this layer changes:

```typescript
export class SampleDataRepository {
    async create(data: CreateSampleDataRequest): Promise<SampleData> {
        // In-memory implementation (swap for Prisma/Drizzle queries later)
        const newItem = { id: this.nextId++, ...data };
        this.sampleData.push(newItem);
        return newItem;
    }
}
```

## 5. BaseController

All controllers extend `BaseController` (`src/controllers/base.controller.ts`), which provides three standardized response methods:

- **`handleSuccess(res, data, message?, statusCode?)`** — Returns a JSON success response via `ApiResponse.success()`.
- **`handleError(res, message, statusCode?, details?)`** — Returns a JSON error response via `ApiResponse.error()`. Logs internal errors (500+) automatically.
- **`handleNoContent(res)`** — Returns a `204 No Content` response for successful deletions.

This ensures no controller ever calls raw `res.status().json()` directly, keeping response formatting uniform across the entire API.

## 6. Structured Error Handling

The project uses typed error classes in `src/utils/errors.ts` instead of raw `Error` objects with ad-hoc status codes:

- **`AppError`** — Base class with `statusCode` and `isOperational` flag
- **`NotFoundError`** — 404 errors with resource-specific messages
- **`ValidationError`** — 400 errors with attached detail payloads
- **`UnauthorizedError`** — 401 authentication failures
- **`ForbiddenError`** — 403 authorization failures

The auth middleware throws `UnauthorizedError` directly, allowing the global error handler in `app.ts` to format all error responses consistently.

## 7. Testing Framework

The project utilizes `Vitest` as its testing runner and `Supertest` for integration testing.

- **Unit Tests**: Found in `*.service.test.ts`, verifying independent business logic.
- **Integration Tests**: Found in `*.routes.test.ts`, verifying end-to-end API correctness.
- **Environment**: Test-specific env vars are provided via `vitest.config.ts`.

## 8. API Documentation (Scalar)

The project automatically generates a visual API playground using **Scalar / OpenAPI 3.0**.

- **Implementation**: Managed in `src/utils/swagger.ts`. It uses `@asteasolutions/zod-to-openapi` to programmatically generate the OpenAPI specification directly from your code and Zod schemas.
- **Single Registration**: Zod is extended with OpenAPI support once in `src/utils/openapi-registry.ts`. Schema files import the shared `registry` to register their types.
- **Dry Documentation**: By registering Zod schemas with the central `OpenAPIRegistry`, your documentation stays 100% in sync with your validation logic.
- **Access**: You can [access live interactive documentation](http://localhost:3000/api-docs).

## 9. Configuration Management (Zod + process.env)

Environment-based configuration is validated directly from `process.env` using Zod.

- **Single Source**: All configuration reads from environment variables (loaded via Node.js `--env-file` flag).
- **Validation**: On startup, `src/utils/config.ts` parses `process.env` against a Zod schema with defaults and coercion (e.g., `PORT` string → number).
- **Fail Fast**: The app exits immediately with a descriptive error if any required variable is missing or invalid.
- **No Extra Libraries**: No `node-config`, `dotenv`, or other config packages — just Zod and `process.env`.

## 10. Logging (Pino)

The project uses **Pino** for high-performance structured JSON logging.

- **Structured Output**: Every log entry is a JSON object with `method`, `url`, `statusCode`, `durationMs`, and `requestId` fields.
- **Request Tracing**: The `requestId` from the request-id middleware is included in every log entry, enabling end-to-end request tracing.
- **Dev-Friendly**: Uses `pino-pretty` in non-production environments for colorized, readable console output.
- **Production-Ready**: Outputs raw JSON in production for direct ingestion by log aggregators (ELK, Datadog, etc.).

## 11. Security

### Rate Limiting
- **Global limiter**: 100 requests per 15 minutes per IP, applied to all routes.
- **Auth limiter**: 5 requests per 15 minutes per IP, applied specifically to `/auth/login` to prevent brute-force attacks.

### CORS
- Configurable via the `CORS_ORIGIN` environment variable.
- Defaults to `*` for development. Set to your frontend domain in production (e.g., `CORS_ORIGIN=https://yourdomain.com`).

### Body Size Limit
- `express.json()` and `express.urlencoded()` are capped at `16kb` to prevent large payload denial-of-service attacks.

## 12. Graceful Shutdown

The application is configured to handle termination signals (`SIGTERM`, `SIGINT`) gracefully.

- **Cleanup**: The `gracefulShutdown` function in `src/server.ts` automatically triggers the `disconnectDatabase()` utility in `src/utils/db.ts` to ensure all external resources are released properly.

## 13. Standardized API Responses

To ensure consistency for frontend consumers, the backend utilizes a standardized JSON response format via the `ApiResponse` helper module.

- **Success Pattern**: Returns `{ success: true, message: "...", data: [...] }`.
- **Error Pattern**: Returns `{ success: false, message: "...", error: { code: 400, details: [...] } }`.

The `ApiResponse` module is used internally by `BaseController` — controllers never format JSON directly.

## 14. Bearer Token Authentication (JWT)

The project includes built-in support for securing routes using **JSON Web Tokens (JWT)**.

- **Library**: Uses `jose` — a modern, maintained, ESM-native JOSE library.
- **Middleware**: The `authenticate` middleware in `src/middleware/auth.middleware.ts` extracts the Bearer token from the `Authorization` header and verifies it using `jwtVerify`. It throws `UnauthorizedError` on failure, which the global error handler catches and formats.
- **Typed Payload**: The decoded token is cast to `JwtPayload` (defined in `src/types/auth.types.ts`), providing type-safe access to `id`, `email`, and `role`.
- **Password Hashing**: Uses `argon2` (OWASP-recommended) instead of bcrypt for password verification.
- **Secret Management**: Managed via the `JWT_SECRET` environment variable.

## 15. Request Tracing

Every incoming request is assigned a unique ID via the `requestId` middleware in `src/middleware/request-id.middleware.ts`.

- **Header**: The `X-Request-Id` header is set on every response.
- **Client-Provided**: If the client sends an `X-Request-Id` header, it is preserved; otherwise, a new UUID is generated.
- **Structured Logging**: The ID is included in every Pino log entry, enabling full end-to-end tracing of a single request through the system.
- **Access**: Available in `res.locals.requestId` for use in controllers, services, and error reporting.
