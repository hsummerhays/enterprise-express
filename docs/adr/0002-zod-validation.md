# ADR-0002: Zod for Validation and Type Inference

## Status
**Accepted** — 2026-03-05

## Context
We needed a validation strategy that satisfies three requirements simultaneously:

1. **Runtime input validation** — Reject malformed HTTP payloads before they reach business logic.
2. **Compile-time type safety** — Derive TypeScript types from the same source of truth that validates at runtime.
3. **OpenAPI documentation** — Generate accurate API specs without maintaining a separate schema file.

Common alternatives:
- **class-validator / class-transformer** — Requires decorators and `reflect-metadata`, adding runtime overhead and magic. Types are inferred from classes, not schemas.
- **Joi** — Mature validation library, but TypeScript type inference is weak and requires separate type definitions.
- **JSON Schema (Ajv)** — Fast validation, but no native TypeScript inference. Requires manual type definitions.

## Decision
We chose **Zod** as the single source of truth for validation, types, and documentation.

```typescript
// src/domain/user.schema.ts
export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
    }),
});

// Type is automatically inferred — no manual interface needed
export type CreateUserDTO = z.infer<typeof createUserSchema>["body"];
```

Additionally, we use `@asteasolutions/zod-to-openapi` to register schemas with an OpenAPI registry, generating Scalar API documentation automatically.

### Validation Middleware
A generic `validate()` middleware accepts any Zod schema and validates `req.body`, `req.query`, and `req.params` in a single pass:

```typescript
export const validate = (schema: ZodTypeAny) =>
    async (req: Request, res: Response, next: NextFunction) => {
        await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
        return next();
    };
```

## Consequences

### Positive
- **Single source of truth** — One schema definition drives runtime validation, TypeScript types, and API documentation.
- **Edge validation** — Invalid data is rejected at the HTTP boundary. Services and repositories only ever receive validated, typed data.
- **Composable** — Shared schemas like `idParamSchema` (`src/domain/common.schema.ts`) can be reused across routes.
- **No decorators** — Works with plain objects and functions. No `reflect-metadata` or experimental decorator support needed.

### Negative
- **Vendor lock-in** — Zod is not a standard. Migrating to a different validation library would require rewriting all schemas.
- **Bundle size** — Zod adds ~13KB gzipped. Negligible for a server application, but worth noting.

### Mitigations
- Zod has become the de facto standard in the TypeScript ecosystem (5M+ weekly npm downloads).
- Schemas are isolated in `src/domain/`, making a future migration contained.

## References
- [Zod Documentation](https://zod.dev/)
- [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi)
