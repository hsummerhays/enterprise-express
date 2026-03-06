# Express Backend vs. Spring Boot: Microservices Architecture Comparison

This document maps the architectural patterns in this project to their equivalents in modern Java Enterprise ecosystems (Spring Boot / Spring Cloud).

## 📊 Feature Mapping

| Feature | Express 5 + TypeScript | Spring Boot 3.x / 4.x |
| :--- | :--- | :--- |
| **Component Model** | ES6 Classes (exported) | `@Component`, `@Service`, `@Controller` |
| **Dependency Injection** | Constructor-based (Manual, 4-layer) | `@Autowired` or Constructor Inject |
| **Request Validation** | [Zod](https://zod.dev/) | Spring Validation / Hibernate Validator |
| **Auth / JWT** | [jose](https://github.com/panva/jose) + [Argon2](https://github.com/ranieri/node-argon2) | Spring Security / JWT |
| **API Docs** | [Zod-to-OpenAPI](https://github.com/asteasolutions/zod-to-openapi) + [Scalar](https://github.com/scalar/scalar) | SpringDoc OpenAPI / Swagger UI |
| **Logging** | [Pino](https://github.com/pinojs/pino) | Logback / SLF4J |
| **Config Management** | Zod-validated `process.env` | `application.properties` / `.yml` |
| **Linting** | [Biome](https://biomejs.dev/) | Checkstyle / PMD |
| **Testing** | [Vitest](https://vitest.dev/) | JUnit 5 + Mockito |
| **Integration Test** | [Supertest](https://github.com/ladjs/supertest) | `MockMvc` / `TestRestTemplate` |
| **Rate Limiting** | [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) (Global + Auth) | Bucket4j / Spring Cloud Gateway |

## 🧩 Architectural Equivalents

### 1. The Controller Layer
In this project, all controllers extend `BaseController` (`src/controllers/*.ts`). These mirror Spring MVC `@RestController` classes.
- **This project**: `export class Controller extends BaseController { constructor(private service: Service) { super(); } }`
- **Spring**: `@RestController public class Controller { private final Service service; ... }`
- **`BaseController`** provides `handleSuccess()`, `handleError()`, and `handleNoContent()` — similar to using `ResponseEntity.ok()`, `ResponseEntity.badRequest()`, or setting up a `ResponseBodyAdvice`.

### 2. Repository Pattern
Data access is encapsulated in `src/repositories/*.ts`, perfectly mirroring Spring Data's `@Repository` stereotype.
- **This project**: `class SampleDataRepository { async findAll() { ... } }`
- **Spring**: `@Repository public interface SampleDataRepository extends JpaRepository<SampleData, Long> { ... }`

### 3. Dependency Injection (DI)
We implement constructor-based DI through a 4-layer chain (`src/routes/*.ts`). 
- **Pattern**: Routes act as the **Application Context** manually instantiating Repositories → injecting into Services → injecting into Controllers. This ensures every layer is cleanly mocked in testing, functionally identical to Spring's IoC container injecting `@Service` and `@Repository` beans.

### 4. Graceful Shutdown
Our `src/server.ts` handles `SIGTERM`.
- **Equivalence**: This mirrors `@PreDestroy` logic or Spring's native `server.shutdown=graceful` configuration.

### 5. Middleware as Filters
`src/middleware/*.ts` are the exact equivalent of **Spring Security Filters** or `HandlerInterceptor`.
- **Auth**: Our JWT middleware throwing an `UnauthorizedError` mirrors a `OncePerRequestFilter` throwing an `AuthenticationException`.
- **Security & CORS**: Our use of `helmet` and `cors({ origin: config.app.corsOrigin })` acts similarly to `HttpSecurity.cors()` and `HttpSecurity.headers()`.

## 🚀 Native Performance
Unlike traditional Spring Boot (which often requires GraalVM for fast startup), this project boots in **< 10ms** natively on WSL/Linux using Node.js v24.
