# Express Backend vs. .NET 10: Microservices Architecture Comparison

This document maps the architectural patterns in this project to their equivalents in modern C# / ASP.NET Core 9.0 and 10.0 ecosystems.

## 📊 Feature Mapping

| Feature | Express 5 + TypeScript | ASP.NET Core 9/10 |
| :--- | :--- | :--- |
| **Component Model** | ES6 Classes (exported) | `class`, `record`, `interface` |
| **Dependency Injection** | Constructor-based (Manual) | `Microsoft.Extensions.DependencyInjection` |
| **Request Validation** | [Zod](https://zod.dev/) | Data Annotations / FluentValidation |
| **Auth / JWT** | [jose](https://github.com/panva/jose) + [Argon2](https://github.com/ranieri/node-argon2) | ASP.NET Identity / MSAL |
| **API Docs** | [Zod-to-OpenAPI](https://github.com/asteasolutions/zod-to-openapi) + [Scalar](https://github.com/scalar/scalar) | Swashbuckle / Scalar / OpenAPI 4.0 |
| **Logging** | [Winston](https://github.com/winstonjs/winston) | `ILogger` / Serilog |
| **Config Management** | Zod-validated `process.env` | `appsettings.json` / `IConfiguration` |
| **Linting** | [Biome](https://biomejs.dev/) | .NET Analyzers / StyleCop |
| **Testing** | [Vitest](https://vitest.dev/) | xUnit / NUnit + Moq |
| **Integration Test** | [Supertest](https://github.com/ladjs/supertest) | `WebApplicationFactory` |

## 🧩 Architectural Equivalents

### 1. Unified Controllers
In this project, we use `src/controllers/*.ts`. These mirror ASP.NET Core Controllers.
- **This project**: `export class Controller { constructor(private service: Service) {} }`
- **.NET**: `public class Controller(IService service) : ControllerBase { ... }` (Primary Constructor)

### 2. Dependency Injection (DI)
We implement constructor-based DI at the route orchestration layer. 
- **Pattern**: While .NET uses a runtime container (`IServiceCollection`), this project uses a **Composition Root** pattern within the routers. This ensures compile-time safety and zero reflection overhead.

### 3. Middleware Pipeline
`src/app.ts` defines the middleware order.
- **Equivalence**: This is the exact equivalent of the `app.UseMiddleware()` pipeline in `Program.cs`. We handle CORS, Security (Helmet), and Errors in the same sequential pattern.

### 4. Custom Request Objects
Our `AuthenticatedRequest` interface in `auth.middleware.ts` mirrors the practice of extending the `HttpContext.User` or using custom `Request` objects in modern Minimal APIs.

## 🚀 Native Performance
Where .NET requires a JIT compilation or NativeAOT, this project provides an immediately responsive experience on WSL2 with standard V8 optimization, making it ideal for micro-containerized workflows.
