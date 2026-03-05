# Express Backend vs. Spring Boot: Microservices Architecture Comparison

This document maps the architectural patterns in this project to their equivalents in modern Java Enterprise ecosystems (Spring Boot / Spring Cloud).

## 📊 Feature Mapping

| Feature | Express 5 + TypeScript | Spring Boot 3.x / 4.x |
| :--- | :--- | :--- |
| **Component Model** | ES6 Classes (exported) | `@Component`, `@Service`, `@Controller` |
| **Dependency Injection** | Constructor-based (Manual) | `@Autowired` or Constructor Inject |
| **Request Validation** | [Zod](https://zod.dev/) | Spring Validation / Hibernate Validator |
| **Auth / JWT** | [jose](https://github.com/panva/jose) + [Argon2](https://github.com/ranieri/node-argon2) | Spring Security / JWT |
| **API Docs** | [Zod-to-OpenAPI](https://github.com/asteasolutions/zod-to-openapi) + [Scalar](https://github.com/scalar/scalar) | SpringDoc OpenAPI / Swagger UI |
| **Logging** | [Winston](https://github.com/winstonjs/winston) | Logback / SLF4J |
| **Config Management** | Zod-validated `process.env` | `application.properties` / `.yml` |
| **Linting** | [Biome](https://biomejs.dev/) | Checkstyle / PMD |
| **Testing** | [Vitest](https://vitest.dev/) | JUnit 5 + Mockito |
| **Integration Test** | [Supertest](https://github.com/ladjs/supertest) | `MockMvc` / `TestRestTemplate` |

## 🧩 Architectural Equivalents

### 1. The Controller Layer
In this project, we use `src/controllers/*.ts`. These mirror Spring MVC Controllers.
- **This project**: `export class Controller { constructor(private service: Service) {} }`
- **Spring**: `@RestController public class Controller { private final Service service; ... }`

### 2. Dependency Injection (DI)
We implement constructor-based DI at the route level (`src/routes/*.ts`). 
- **Pattern**: Routes act as the **Application Context**, instantiating services and injecting them into controllers. This ensures services are easy to mock, identical to Spring's Core Container logic.

### 3. Graceful Shutdown
Our `src/server.ts` handles `SIGTERM`.
- **Equivalence**: This mirrors `@PreDestroy` logic or Spring's native `server.shutdown=graceful` configuration.

### 4. Middleware as Filters
`src/middleware/*.ts` are the exact equivalent of **Spring Security Filters** or `HandlerInterceptor`.
- **Auth**: Our JWT middleware mirrors a `UsernamePasswordAuthenticationFilter` or a custom `OncePerRequestFilter`.

## 🚀 Native Performance
Unlike traditional Spring Boot (which often requires GraalVM for fast startup), this project boots in **< 10ms** natively on WSL/Linux using Node.js v24.
