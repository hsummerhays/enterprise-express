# Express Backend (WSL-Native)

A modern Node.js backend environment optimized for Windows 11 WSL2 and Google Antigravity.

## Tech Stack

- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Runtime**: [Node.js v24.x](https://nodejs.org/) (ESM mode)
- **Web App**: [Express 5](https://expressjs.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Auth**: [jose](https://github.com/panva/jose) (JWT) + [Argon2](https://github.com/ranieri/node-argon2) (password hashing)
- **Database**: In-memory storage (Extensible to MongoDB/PostgreSQL).
- **Documentation**: [Zod-to-OpenAPI](https://github.com/asteasolutions/zod-to-openapi) + [Scalar](https://github.com/scalar/scalar)
- **Logging**: [Winston](https://github.com/winstonjs/winston)
- **Testing**: [Vitest](https://vitest.dev/) & [Supertest](https://github.com/ladjs/supertest)

## 🛠️ Performance & Security

- **Graceful Shutdown**: Ready for production environments.
- **Rate Limiting**: [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) to mitigate brute-force.
- **Security Headers**: [Helmet](https://helmetjs.github.io/) to secure your Express app.
- **Request Tracing**: Every response includes an `X-Request-Id` header for distributed traceability.
- **Structured Errors**: Typed error classes (`AppError`, `NotFoundError`, `ValidationError`) for consistent error handling.
- **Standardized Responses**: Unified JSON API responses via the `ApiResponse` helper.

## 🚀 Rapid Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment (if not using WSL mirrored mode)
cp .env.example .env

# 3. Ready to go
npm run dev
```
For complete instructions on configuring Windows 11 WSL2 and Google Antigravity to run this project natively on Ubuntu, please read the [WSL & Antigravity Setup Guide](./wsl-setup.md).

## 🏗 Architecture

The project follows an enterprise-style separation of concerns, mirroring patterns found in C# and Java:

* **`src/app.ts`**: The Application assembly. Configures Express middleware (security → parsing → routes), error handlers, and API docs.
* **`src/controllers/`**: Thin classes that receive services via constructor injection, orchestrate responses.
* **`src/middleware/`**: Request logging, Zod validation, JWT authentication, rate limiting, and request ID generation.
* **`src/routes/`**: Modular route definitions exporting Express routers.
* **`src/schemas/`**: Zod validation schemas registered with the OpenAPI registry.
* **`src/services/`**: Class-based business logic and data access handlers.
* **`src/utils/`**: Shared utilities — logger, config, errors, database templates, and the `ApiResponse` helper.
* **`src/types/`**: TypeScript type declarations — `JwtPayload`, Express augmentations.
* **`GET /api-docs`**: The live interactive Scalar API documentation endpoint.
 
## 📚 Documentation & Resources
 
- [Code Walkthrough](./walkthrough.md) - A deep dive into the project structure and request lifecycle.
- [WSL & Antigravity Setup](./wsl-setup.md) - Detailed environment configuration guide.
- [Database Connection](./database-setup.md) - Guidance for connecting MongoDB and PostgreSQL.
- [Configuration Management](./config-management.md) - Zod-validated environment configuration.
- [C# .NET 10 Comparison](./dotnet10-microservices-comparison.md) - Comparing Express 5 with modern .NET 10 microservices.
- [Spring Boot 4 Comparison](./springboot4-microservices-comparison.md) - Comparing Express 5 with Java 25 / Spring Boot 4.

## 🚀 Development Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the server with tsx watch mode and `.env` support. |
| `npm test` | Runs the integration and unit test suites utilizing Vitest and Supertest. |
| `npm run build` | Compiles TypeScript to JavaScript in `dist/`. |
| `npm start` | Production-style start using compiled JavaScript. |
| `npm run lint` | Runs Biome linter and formatter checks. |
| `npm run format` | Auto-formats source code with Biome. |
 
## 📡 Networking & Ports

* **Default Port:** `3000` (Configurable via `PORT` in `.env`)
* **Access:** Reachable via `http://localhost:3000` on the Windows host.
* **Notifications:** Port-forwarding notifications can be disabled via the Antigravity/VS Code settings gear to prevent redundant prompts in Mirrored Mode.

## 🛡 Security & Git

* **.env**: Local secrets and ports (Ignored by Git).
* **node_modules**: Linux-specific dependencies (Ignored by Git).
* **package-lock.json**: Tracked to ensure reproducible builds across the WSL environment.