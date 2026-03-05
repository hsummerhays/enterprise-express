# Code Walkthrough: WSL-Native TypeScript Express Backend

This walkthrough explains the core architecture of the Express backend project. The project is structured with an enterprise-style separation of concerns, ensuring that the codebase remains maintainable, testable, and robust in a TypeScript environment.

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

1. **Security first**: `helmet`, `cors`, `express-rate-limit`
2. **Request lifecycle**: Request ID generation, Winston-powered request logging
3. **Body parsing**: `express.json()` and `express.urlencoded()`
4. **Routes**: Health, auth, and sample data endpoints
5. **Error handling**: 404 handler using `AppError`, global error handler with structured responses

The global error handler distinguishes between operational errors (`AppError` subclasses) and unexpected errors, only exposing stack traces in development.

## 3. The Request Lifecycle (Example: Sample Data)

When an HTTP request enters the system, it typically traverses through the following layers:

### A. Routes (`src/routes/sample-data.routes.ts`)
Routes map HTTP endpoints to controller methods. Notice how validation is treated as a gatekeeper middleware:

```typescript
// Validation acts as the gatekeeper here
router.post('/', authenticate, validate(createSampleDataSchema), sampleDataController.create);
```

### B. Validation Middlewares & Schemas (`src/schemas/` & `src/middleware/`)
The `validate` middleware executes a given Zod schema against the incoming request. If the payload is invalid, the middleware intercepts the request and returns a structured `400 Bad Request` containing the specific `ZodError` issues before it ever reaches the controller.

The middleware accepts any `ZodTypeAny` schema, making it flexible enough for objects, unions, and intersections.

### C. Controllers (`src/controllers/sample-data.controller.ts`)
Controllers are thin classes that receive their dependencies (like services) through their **constructor**. This makes them extremely easy to unit test by passing in mocked services. Controllers import `ApiResponse` directly as a module.

```typescript
import ApiResponse from '../utils/api-response.js';

export class SampleDataController {
    constructor(private sampleDataService: SampleDataService) {}

    create = async (req: Request, res: Response) => {
        const newItem = await this.sampleDataService.create(req.body);
        res.status(201).json(ApiResponse.success(newItem));
    };
}
```

### D. Services (`src/services/sample-data.service.ts`)
Services are class-based definitions where business logic lives. They are instantiated and passed into controllers at the route level.

```typescript
export class SampleDataService {
    async create(data: CreateSampleDataRequest): Promise<SampleData> {
        // Business logic here
        return newItem;
    }
}
```

## 4. Structured Error Handling

The project uses typed error classes in `src/utils/errors.ts` instead of raw `Error` objects with ad-hoc status codes:

- **`AppError`** — Base class with `statusCode` and `isOperational` flag
- **`NotFoundError`** — 404 errors with resource-specific messages
- **`ValidationError`** — 400 errors with attached detail payloads
- **`UnauthorizedError`** — 401 authentication failures
- **`ForbiddenError`** — 403 authorization failures

The global error handler in `app.ts` checks `instanceof AppError` to determine the response shape and whether to log the full stack trace.

## 5. Testing Framework

The project utilizes `Vitest` as its testing runner and `Supertest` for integration testing.

- **Unit Tests**: Found in `*.service.test.ts`, verifying independent business logic.
- **Integration Tests**: Found in `*.routes.test.ts`, verifying end-to-end API correctness.
- **Environment**: Test-specific env vars are provided via `vitest.config.ts`.

## 6. API Documentation (Scalar)

The project automatically generates a visual API playground using **Scalar / OpenAPI 3.0**.

- **Implementation**: Managed in `src/utils/swagger.ts`. It uses `@asteasolutions/zod-to-openapi` to programmatically generate the OpenAPI specification directly from your code and Zod schemas.
- **Single Registration**: Zod is extended with OpenAPI support once in `src/utils/openapi-registry.ts`. Schema files import the shared `registry` to register their types.
- **Dry Documentation**: By registering Zod schemas with the central `OpenAPIRegistry`, your documentation stays 100% in sync with your validation logic.
- **Access**: You can [access live interactive documentation](http://localhost:3000/api-docs).

## 7. Configuration Management (Zod + process.env)

Environment-based configuration is validated directly from `process.env` using Zod.

- **Single Source**: All configuration reads from environment variables (loaded via Node.js `--env-file` flag).
- **Validation**: On startup, `src/utils/config.ts` parses `process.env` against a Zod schema with defaults and coercion (e.g., `PORT` string → number).
- **Fail Fast**: The app exits immediately with a descriptive error if any required variable is missing or invalid.
- **No Extra Libraries**: No `node-config`, `dotenv`, or other config packages — just Zod and `process.env`.

## 8. Graceful Shutdown

The application is configured to handle termination signals (`SIGTERM`, `SIGINT`) gracefully.

- **Cleanup**: The `gracefulShutdown` function in `src/server.ts` automatically triggers the `disconnectDatabase()` utility in `src/utils/db.ts` to ensure all external resources are released properly.

## 9. Standardized API Responses

To ensure consistency for frontend consumers, the backend utilizes a standardized JSON response format via the `ApiResponse` helper module.

- **Success Pattern**: Returns `{ success: true, message: "...", data: [...] }`.
- **Error Pattern**: Returns `{ success: false, message: "...", error: { code: 400, details: [...] } }`.

The `ApiResponse` module is imported directly by controllers and middleware — no runtime injection needed.

## 10. Bearer Token Authentication (JWT)

The project includes built-in support for securing routes using **JSON Web Tokens (JWT)**.

- **Library**: Uses `jose` — a modern, maintained, ESM-native JOSE library.
- **Middleware**: The `authenticate` middleware in `src/middleware/auth.middleware.ts` extracts the Bearer token from the `Authorization` header and verifies it using `jwtVerify`.
- **Typed Payload**: The decoded token is cast to `JwtPayload` (defined in `src/types/auth.types.ts`), providing type-safe access to `id`, `email`, and `role`.
- **Password Hashing**: Uses `argon2` (OWASP-recommended) instead of bcrypt for password verification.
- **Secret Management**: Managed via the `JWT_SECRET` environment variable.

## 11. Request Tracing

Every incoming request is assigned a unique ID via the `requestId` middleware in `src/middleware/request-id.middleware.ts`.

- **Header**: The `X-Request-Id` header is set on every response.
- **Client-Provided**: If the client sends an `X-Request-Id` header, it is preserved; otherwise, a new UUID is generated.
- **Traceability**: The ID is available in `res.locals.requestId` for use in logging and error reporting.
