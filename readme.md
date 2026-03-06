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
- **Logging**: [Pino](https://github.com/pinojs/pino) (structured JSON, ~5x faster than Winston)
- **Testing**: [Vitest](https://vitest.dev/) & [Supertest](https://github.com/ladjs/supertest)

## 🛠️ Performance & Security

- **Graceful Shutdown**: Ready for production environments.
- **Rate Limiting**: Global limiter (100 req/15 min) + strict auth limiter (5 req/15 min) via [express-rate-limit](https://www.npmjs.com/package/express-rate-limit).
- **Security Headers**: [Helmet](https://helmetjs.github.io/) to secure your Express app.
- **CORS**: Configurable allowed origins via the `CORS_ORIGIN` environment variable (defaults to `*` for development).
- **Body Size Limit**: Request bodies capped at `16kb` to prevent large payload DoS.
- **Request Tracing**: Every response includes an `X-Request-Id` header, and all log entries include the `requestId` for full end-to-end traceability.
- **Structured Errors**: Typed error classes (`AppError`, `NotFoundError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`) for consistent error handling.
- **Standardized Responses**: Unified JSON API responses via the `ApiResponse` helper and `BaseController`.

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

The project follows a strict layered architecture with constructor-based dependency injection:

```
Routes → Controllers → Services → Repositories
```

* **`src/app.ts`**: The Application assembly. Configures Express middleware (security → parsing → routes), error handlers, and API docs.
* **`src/controllers/`**: Extend `BaseController` for standardized responses. Receive services via constructor injection.
* **`src/middleware/`**: Request logging, Zod validation, JWT authentication (throws `UnauthorizedError`), rate limiting, and request ID generation.
* **`src/repositories/`**: Data access layer. Encapsulates all storage operations (in-memory, database).
* **`src/routes/`**: Modular route definitions. Orchestrate DI by instantiating Repositories → Services → Controllers.
* **`src/schemas/`**: Zod validation schemas registered with the OpenAPI registry.
* **`src/services/`**: Class-based business logic. Framework-agnostic, receives repositories via constructor.
* **`src/utils/`**: Shared utilities — logger (Pino), config, errors, database templates, and the `ApiResponse` helper.
* **`src/types/`**: TypeScript type declarations — `JwtPayload`, Express augmentations.
* **`GET /api-docs`**: The live interactive Scalar API documentation endpoint.

### 🌐 CORS Configuration

By default, `CORS_ORIGIN` is set to `*` (allow all origins) for development convenience. **In production**, set this to your frontend domain(s):

```env
# Single origin
CORS_ORIGIN=https://yourdomain.com

# For development (default)
CORS_ORIGIN=*
```
 
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