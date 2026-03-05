# Code Walkthrough: WSL-Native Express Backend

This walkthrough explains the core architecture of the Express backend project. The project is structured with an enterprise-style separation of concerns, ensuring that the codebase remains maintainable, testable, and robust.

## 1. Entry Point: `src/server.js`

This file is responsible for initializing the environment and igniting the HTTP server. 

```javascript
import app from './app.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info('Express server successfully ignited', {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        wsl_mode: 'mirrored'
    });
});
```

Because this project is configured for Node v24+, environment variables are loaded directly via the `--env-file` flag when executing the startup script, rather than relying on a library like `dotenv`.

## 2. Express Setup: `src/app.js`

The `app.js` file handles all top-level Express routing, security middleware, rate limiting, and global error handling.

- **Security & Reliability**: Configures `helmet` for security headers, `cors` for cross-origin resource sharing, and `express-rate-limit` to prevent brute force attacks.
- **Logging**: Injects a custom request logger middleware powered by Winston.
- **Centralized Errors**: The global error handler at the bottom automatically catches thrown Promise rejections (a feature natively supported by Express 5).

## 3. The Request Lifecycle (Example: Sample Data)

When an HTTP request enters the system, it typically traverses through the following layers:

### A. Routes (`src/routes/sample-data.routes.js`)
Routes map HTTP endpoints to controller methods. Notice how validation is treated as a gatekeeper middleware:

```javascript
// Validation acts as the gatekeeper here
router.post('/', validate(createSampleDataSchema), sampleDataController.create);
```

### B. Validation Middlewares & Schemas (`src/schemas/` & `src/middleware/`)
The `validate` middleware executes a given Zod schema against the incoming request. If the payload is invalid, the middleware intercepts the request and returns a structured `400 Bad Request` containing the specific `ZodError` issues before it ever reaches the controller.

### C. Controllers (`src/controllers/sample-data.controller.js`)
Controllers are thin classes that receive their dependencies (like services) through their **constructor**. This makes them extremely easy to unit test by passing in mocked services.

```javascript
export class SampleDataController {
    constructor(sampleDataService) {
        this.sampleDataService = sampleDataService;
    }

    create = async (req, res) => {
        const newItem = await this.sampleDataService.create(req.body);
        res.status(201).json(res.locals.ApiResponse.success(newItem));
    };
}
```

### D. Services (`src/services/sample-data.service.js`)
Services are class-based definitions where business logic lives. They are instantiated and passed into controllers at the route level.

```javascript
export class SampleDataService {
    async create(data) {
        // Database logic here
        return newItem;
    }
}
```

## 4. Subpackage Imports Mapping

To keep `import` paths clean (avoiding annoying `../../../` syntax), the `package.json` makes use of Node's native Subpath Imports functionality:

```json
  "imports": {
    "#controllers/*": "./src/controllers/*.js",
    "#services/*": "./src/services/*.js",
    "#routes/*": "./src/routes/*.js",
    "#middleware/*": "./src/middleware/*.js",
    "#schemas/*": "./src/schemas/*.js",
    "#utils/*": "./src/utils/*.js"
  }
```

This mapping allows developers to import using `#routes/health.routes` directly from anywhere in the codebase.

## 5. Testing Framework

The project utilizes `Vitest` as its testing runner and `Supertest` for integration testing.

- **Unit Tests**: Found in `*.service.test.js`, verifying independent business logic.
- **Integration Tests**: Found in `*.routes.test.js`, verifying end-to-end API correctness (including HTTP status codes and Zod schema validation errors).

## 6. Database Layer (Extensible)

The project includes boilerplate guidance for connecting to both **MongoDB** and **PostgreSQL** in `src/utils/db.js`.

- **Guidance**: Detailed setup instructions can be found in [database-setup.md](./database-setup.md).
- **Environment Driven**: Connection strings are managed via `.env` (see `.env.example` for the required keys).
- **Singletons**: Database connections and pools are typically exported as singletons from the `utils` layer to be consumed by services.

## 7. API Documentation (Swagger)

The project automatically generates a visual API playground using **Swagger / OpenAPI 3.0**.

- **Implementation**: Managed in `src/utils/swagger.js`. It uses `@asteasolutions/zod-to-openapi` to programmatically generate the OpenAPI specification directly from your code and Zod schemas.
- **Dry Documentation**: By registering Zod schemas with the central `OpenAPIRegistry`, your documentation stays 100% in sync with your validation logic, eliminating the need for manual JSDoc maintenance.
- **Registry**: Endpoint path definitions are also maintained in code within the registry, providing a centralized location for API metadata.
- **Access**: You can [access live interactive documentation](http://localhost:3000/api-docs).

## 8. Configuration Management (Zod + Config)

Robust environment-based configuration management using the `config` library.

- **Hierarchy**: Configs are merged from `config/default.json`, `{env}.json`, and environment variables mapped in `config/custom-environment-variables.json`.
- **Validation**: On application startup, `src/utils/config.js` validates the entire configuration object against a **Zod schema**. This ensures that the application never starts with missing or invalid environment settings.
- **Fail Fast**: The app will exit immediately with a descriptive error if the configuration is invalid.
- **Guidance**: Detailed configuration instructions are found in [config-management.md](./config-management.md).

## 9. Graceful Shutdown

The application is configured to handle termination signals (`SIGTERM`, `SIGINT`) gracefully.

- **Process**: When a signal is received, the server stops accepting new connections and attempts to finish ongoing requests before closing.
- **Cleanup**: The `gracefulShutdown` function in `src/server.js` automatically triggers the `disconnectDatabase()` utility in `src/utils/db.js` to ensure all external resources (pools, connections) are released properly.
- **Safety**: A 10-second timeout is implemented to forcefully shut down the process if resources fail to close in time.

## 10. Standardized API Responses

To ensure consistency for frontend consumers, the backend utilizes a standardized JSON response format.

- **Success Pattern**: Returns `{ success: true, message: "...", data: [...] }`.
- **Error Pattern**: Returns `{ success: false, message: "...", error: { code: 400, details: [...] } }`.
- **Implementation**: The logic is encapsulated in the `ApiResponse` helper class found in `src/utils/api-response.js`. This is used across all controllers, the validation middleware, and the global error handler.

## 11. Dependency Injection (DI)

The project follows a constructor-based Dependency Injection pattern to ensure high testability and decoupled components.

- **Pattern**: Instead of controllers importing services directly (singleton pattern), they receive service instances through their `constructor`.
- **Instantiation**: Services are instantiated at the **Route level** and passed into the controller classes. This centralized orchestration makes it easy to swap implementations or inject mocks during unit testing.
- **Utility Injection**: Shared utilities like `ApiResponse` are injected into the request lifecycle via `src/middleware/di.middleware.js`, making them available on `res.locals` throughout the request path.

## 12. Bearer Token Authentication (JWT)

The project includes built-in support for securing routes using **JSON Web Tokens (JWT)**.

- **Middleware**: The `authenticate` middleware in `src/middleware/auth.middleware.js` extracts the Bearer token from the `Authorization` header and verifies it using the secret defined in the configuration.
- **Configuration**: The JWT secret is managed via the central config system (`auth.jwtSecret`) and can be overridden by the `JWT_SECRET` environment variable.
- **Swagger Integration**: The OpenAPI specification is configured to recognize the `bearerAuth` scheme. Protected endpoints are visually marked with a lock icon in the Swagger UI, allowing you to input a token for testing.
- **Usage**: To protect a route, simply prepend the `authenticate` middleware to the route definition:
  ```javascript
  router.post('/', authenticate, sampleDataController.create);
  ```

## 13. Login & JWT Generation

To generate the tokens required for Bearer Authentication, the project provides a dedicated auth route.

- **Endpoint**: `POST /auth/login`
- **Logic**: The `AuthService` handles credential verification. In this demo environment, it uses a mock account (`admin@example.com` / `P@ssword123`).
- **Token Payload**: Upon successful login, a JWT is generated containing the user's basic profile (ID, email, role) and returned in the `data` field of the standardized response.
- **Expiration**: demo tokens are set to expire in 1 hour.
- **Security**: The login request is validated using a strict Zod schema (`src/schemas/auth.schema.js`) to ensure proper formatting before processing.
