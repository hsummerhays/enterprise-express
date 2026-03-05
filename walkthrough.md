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
Controllers are thin layers responsible entirely for extracting data from the request, invoking business logic, and standardizing the HTTP response format.

```javascript
class SampleDataController {
    create = async (req, res) => {
        const { title, completed } = req.body;
        // The title is already validated by the Zod schema
        const newItem = await sampleDataService.create({ title, completed });
        res.status(201).json(newItem);
    };
}
```

### D. Services (`src/services/sample-data.service.js`)
Services are class-based singletons where the actual business logic and database interactions occur.

```javascript
class SampleDataService {
    constructor() {
        this.sampleData = [...];
    }

    async create(data) {
        // Business logic to create an item
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
