# Express Backend (WSL-Native)

A modern Node.js backend environment optimized for Windows 11 WSL2 and Google Antigravity.

## Tech Stack

- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Runtime**: [Node.js v24.x](https://nodejs.org/) (ESM mode)
- **Web App**: [Express 5](https://expressjs.com/)
- **Validation**: [Zod](https://zod.dev/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Documentation**: [Zod-to-OpenAPI](https://github.com/asteasolutions/zod-to-openapi) 
- **Logging**: [Winston](https://github.com/winstonjs/winston)
- **Testing**: [Vitest](https://vitest.dev/) & [Supertest](https://github.com/ladjs/supertest)

## 🛠️ Performance & Security

- **Graceful Shutdown**: Ready for production environments.
- **Rate Limiting**: [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) to mitigate brute-force.
- **Security Headers**: [Helmet](https://helmetjs.github.io/) to secure your Express app.
- **Standardized Responses**: Unified JSON API responses.

## 🚀 Rapid Ignite

```bash
# 1. Install dependencies
npm install

# 2. Setup environment (if not using WSL mirrored mode)
cp .env.example .env

# 3. Initialize Database (Prisma)
npx prisma migrate dev --name init
npm run seed

# 4. Burn the ignition
npm run dev
```
For complete instructions on configuring Windows 11 WSL2 and Google Antigravity to run this project natively on Ubuntu, please read the [WSL & Antigravity Setup Guide](./wsl-setup.md).

## 🏗 Architecture

The project follows an enterprise-style separation of concerns, mirroring patterns found in C# and Java:

* **`src/app.js`**: The Application assembly. Configures Express middleware, security headers, rate limiting, and global error handlers.
* **`src/controllers/`**: Handles incoming requests, orchestrates data validation, and structures API responses.
* **`src/middleware/`**: Contains custom request loggers and a generalized Zod validation middleware.
* **`src/routes/`**: Modular route definitions exporting Express routers.
* **`src/schemas/`**: Zod validation schemas to strongly type and validate incoming API requests.
* **`src/services/`**: Class-based business logic and data access handlers.
* **`src/utils/`**: Shared utilities (logger, database templates, and the ApiResponse helper).
* **`GET /api-docs`**: The live interactive Swagger/OpenAPI documentation endpoint.
 
## 📚 Documentation & Resources
 
- [Code Walkthrough](./walkthrough.md) - A deep dive into the project structure and request lifecycle.
- [WSL & Antigravity Setup](./wsl-setup.md) - Detailed environment configuration guide.
- [Database Connection](./database-setup.md) - Guidance for connecting MongoDB and PostgreSQL.
- [Configuration Management](./config-management.md) - Robust environment-based settings with Zod validation.
- [C# .NET 10 Comparison](./dotnet10-microservices-comparison.md) - Comparing Express 5 with modern .NET 10 microservices.
- [Spring Boot 4 Comparison](./springboot4-microservices-comparison.md) - Comparing Express 5 with Java 25 / Spring Boot 4.

## 🚀 Development Commands
Before running these commands, ensure you select the appropriate node version, and run the following command to grab all the required dependencies:
```bash
npm install express cors helmet express-rate-limit winston zod
npm install -D vitest supertest
```

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the server with Node 24 `--watch` mode and `.env` support. |
| `npm test` | Runs the integration and unit test suites utilizing Vitest and Supertest. |
| `npm start` | Production-style start using standard Node. |
 
## 📡 Networking & Ports

* **Default Port:** `3000` (Configurable in `.env`)
* **Access:** Reachable via `http://localhost:3000` on the Windows host.
* **Notifications:** Port-forwarding notifications can be disabled via the Antigravity/VS Code settings gear to prevent redundant prompts in Mirrored Mode.

## 🛡 Security & Git

* **.env**: Local secrets and ports (Ignored by Git).
* **node_modules**: Linux-specific dependencies (Ignored by Git).
* **package-lock.json**: Tracked to ensure reproducible builds across the WSL environment.