# Code Walkthrough: WSL-Native TypeScript Express Backend

This walkthrough explains the core architecture of the Express backend project. The project is structured with an enterprise-style separation of concerns, ensuring that the codebase remains maintainable, testable, and robust in a TypeScript environment.

## 1. Entry Point: `src/server.ts`

This file is responsible for initializing the environment and igniting the HTTP server. 

```typescript
import app from './app.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info('Express server successfully ready', {
        port: PORT,
        env: process.env.NODE_ENV || 'development'
    });
});
```

Because this project is configured for Node v24+, environment variables are loaded directly via the `--env-file` flag when executing the startup script, rather than relying on an external library.

## 2. Express Setup: `src/app.ts`

The `app.ts` file handles all top-level Express routing, security middleware, rate limiting, and global error handling.

- **Security & Reliability**: Configures `helmet` for security headers, `cors` for cross-origin resource sharing, and `express-rate-limit` to prevent brute force attacks.
- **Logging**: Injects a custom request logger middleware powered by Winston.
- **Centralized Errors**: The global error handler at the bottom automatically catches thrown Promise rejections (a feature natively supported by Express 5).

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

### C. Controllers (`src/controllers/sample-data.controller.ts`)
Controllers are thin classes that receive their dependencies (like services) through their **constructor**. This makes them extremely easy to unit test by passing in mocked services.

```typescript
export class SampleDataController {
    constructor(private sampleDataService: SampleDataService) {}

    create = async (req: Request, res: Response) => {
        const newItem = await this.sampleDataService.create(req.body);
        res.status(201).json(res.locals.ApiResponse.success(newItem));
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

## 4. Subpackage Imports Mapping

To keep `import` paths clean (avoiding annoying `../../../` syntax), the `package.json` makes use of Node's native Subpath Imports functionality:

```json
  "imports": {
    "#controllers/*": "./src/controllers/*.ts",
    "#services/*": "./src/services/*.ts",
    "#routes/*": "./src/routes/*.ts",
    "#middleware/*": "./src/middleware/*.ts",
    "#schemas/*": "./src/schemas/*.ts",
    "#utils/*": "./src/utils/*.ts"
  }
```

This mapping allows developers to import using `#routes/health.routes` directly from anywhere in the codebase.

## 5. Testing Framework

The project utilizes `Vitest` as its testing runner and `Supertest` for integration testing.

- **Unit Tests**: Found in `*.service.test.ts`, verifying independent business logic.
- **Integration Tests**: Found in `*.routes.test.ts`, verifying end-to-end API correctness.

## 6. API Documentation (Swagger)

The project automatically generates a visual API playground using **Swagger / OpenAPI 3.0**.

- **Implementation**: Managed in `src/utils/swagger.ts`. It uses `@asteasolutions/zod-to-openapi` to programmatically generate the OpenAPI specification directly from your code and Zod schemas.
- **Dry Documentation**: By registering Zod schemas with the central `OpenAPIRegistry`, your documentation stays 100% in sync with your validation logic.
- **Access**: You can [access live interactive documentation](http://localhost:3000/api-docs).

## 7. Configuration Management (Zod + Config)

Robust environment-based configuration management using the `config` library.

- **Hierarchy**: Configs are merged from `config/default.json`, `{env}.json`, and environment variables mapped in `config/custom-environment-variables.json`.
- **Validation**: On application startup, `src/utils/config.ts` validates the entire configuration object against a **Zod schema**.
- **Fail Fast**: The app will exit immediately with a descriptive error if the configuration is invalid.

## 8. Graceful Shutdown

The application is configured to handle termination signals (`SIGTERM`, `SIGINT`) gracefully.

- **Cleanup**: The `gracefulShutdown` function in `src/server.ts` automatically triggers the `disconnectDatabase()` utility in `src/utils/db.ts` to ensure all external resources are released properly.

## 9. Standardized API Responses

To ensure consistency for frontend consumers, the backend utilizes a standardized JSON response format via the `ApiResponse` helper class.

- **Success Pattern**: Returns `{ success: true, message: "...", data: [...] }`.
- **Error Pattern**: Returns `{ success: false, message: "...", error: { code: 400, details: [...] } }`.

## 10. Bearer Token Authentication (JWT)

The project includes built-in support for securing routes using **JSON Web Tokens (JWT)**.

- **Middleware**: The `authenticate` middleware in `src/middleware/auth.middleware.ts` extracts the Bearer token from the `Authorization` header and verifies it.
- **Secret Management**: Managed via `auth.jwtSecret` in the configuration.
