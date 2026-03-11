# Express Backend vs. .NET 10: Microservices Architecture Comparison

This document maps the architectural patterns in this project to their equivalents in modern C# / ASP.NET Core 9.0 and 10.0 ecosystems.

## 📊 Feature Mapping

| Feature | Express 5 + TypeScript | ASP.NET Core 9/10 |
| :--- | :--- | :--- |
| **Component Model** | ES6 Classes (exported) | `class`, `record`, `interface` |
| **Dependency Injection** | Constructor-based (Manual, 4-layer) | `Microsoft.Extensions.DependencyInjection` |
| **Request Validation** | [Zod](https://zod.dev/) | Data Annotations / FluentValidation |
| **Auth / JWT** | [jose](https://github.com/panva/jose) + [Argon2](https://github.com/ranieri/node-argon2) | ASP.NET Identity / MSAL |
| **API Docs** | [Zod-to-OpenAPI](https://github.com/asteasolutions/zod-to-openapi) + [Scalar](https://github.com/scalar/scalar) | Swashbuckle / Scalar / OpenAPI 4.0 |
| **Logging** | [Pino](https://github.com/pinojs/pino) | `ILogger` / Serilog |
| **Config Management** | Zod-validated `process.env` | `appsettings.json` / `IConfiguration` |
| **Linting** | [Biome](https://biomejs.dev/) | .NET Analyzers / StyleCop |
| **Testing** | [Vitest](https://vitest.dev/) | xUnit / NUnit + Moq |
| **Integration Test** | [Supertest](https://github.com/ladjs/supertest) | `WebApplicationFactory` |
| **Rate Limiting** | [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) (Global + Auth) | ASP.NET Rate Limiting middleware |

## 🧩 Architectural Equivalents

### 1. Unified Controllers
In this project, all controllers extend `BaseController` (`src/interfaces/http/controllers/*.ts`). This mirrors ASP.NET Core's `ControllerBase`.
- **This project**: `export class Controller extends BaseController { constructor(private useCase: UseCase) { super(); } }`
- **.NET**: `public class Controller(IUseCase useCase) : ControllerBase { ... }` (Primary Constructor)
- **`BaseController`** provides `handleSuccess()`, `handleError()`, and `handleNoContent()` — the same pattern as `Ok()`, `BadRequest()`, and `NoContent()` in ASP.NET.

### 2. Repository Pattern
Data access is encapsulated in `src/infrastructure/repositories/*.ts`, mirroring the Repository Pattern used extensively in .NET with Entity Framework Core.
- **This project**: `class SampleDataRepository { async findAll() { ... } }`
- **.NET**: `class SampleDataRepository : IRepository<SampleData> { ... }`

### 3. Dependency Injection (DI)
The project uses a hand-rolled DI container in `src/bootstrap/container.ts` — the single **Composition Root** that wires the entire object graph: repositories → use cases → controllers.
- **Pattern**: While .NET uses `IServiceCollection` with reflection-based resolution, this project uses class constructors as DI tokens (`container.register(UserController, instance)`). Resolution is type-safe, zero-reflection, and the entire dependency graph is visible in one file — analogous to manually configuring `Program.cs` with explicit `AddScoped<IRepository, SqliteRepository>()`.

### 4. Middleware Pipeline
`src/app.ts` defines the middleware order.
- **Equivalence**: This is the exact equivalent of the `app.UseMiddleware()` pipeline in `Program.cs`. We handle CORS (configurable via `CORS_ORIGIN`), Security (Helmet), Rate Limiting (global + auth-specific), and Errors in the same sequential pattern.
- **Auth middleware** throws typed `UnauthorizedError` exceptions, mirroring ASP.NET's `AuthenticationHandler` which throws `AuthenticationFailureException`.

### 5. Custom Request Objects
Our `AuthenticatedRequest` interface in `src/interfaces/http/middleware/auth.middleware.ts` mirrors the practice of extending `HttpContext.User` or using custom `Request` objects in modern Minimal APIs.

## 🚀 Native Performance
Where .NET requires a JIT compilation or NativeAOT, this project provides an immediately responsive experience on WSL2 with standard V8 optimization, making it ideal for micro-containerized workflows.
