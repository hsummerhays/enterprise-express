# Express Backend (WSL-Native)

A modern Node.js backend environment optimized for Windows 11 WSL2 and Google Antigravity.

## Tech Stack

- **Node.js**: v24.x (using native `--env-file` support)
- **Express**: v5.x (automatic Promise rejection handling)
- **Validation**: Zod
- **Testing**: Vitest & Supertest
- **Security & Logging**: Helmet, CORS, Express Rate Limit, Winston

## 🛠 Environment Setup

For complete instructions on configuring Windows 11 WSL2 and Google Antigravity to run this project natively on Ubuntu, please read the [WSL & Antigravity Setup Guide](./wsl-setup.md).

## 🏗 Architecture

The project follows an enterprise-style separation of concerns, mirroring patterns found in C# and Java:

* **`src/server.js`**: The entry point. Loads environment variables natively and ignites the HTTP server.
* **`src/app.js`**: The Application assembly. Configures Express middleware, security headers, rate limiting, and global error handlers.
* **`src/controllers/`**: Handles incoming requests, orchestrates data validation, and structures API responses.
* **`src/middleware/`**: Contains custom request loggers and a generalized Zod validation middleware.
* **`src/routes/`**: Modular route definitions exporting Express routers.
* **`src/schemas/`**: Zod validation schemas to strongly type and validate incoming API requests.
* **`src/services/`**: Class-based business logic and data access handlers.
* **`src/utils/`**: Shared utilities like the Winston logger.
 
## 📚 Documentation & Resources
 
- [Code Walkthrough](./walkthrough.md) - A deep dive into the project structure and request lifecycle.
- [WSL & Antigravity Setup](./wsl-setup.md) - Detailed environment configuration guide.
- [Database Connection](./database-setup.md) - Guidance for connecting MongoDB and PostgreSQL.
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