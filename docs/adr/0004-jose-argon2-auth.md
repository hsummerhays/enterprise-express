# ADR-0004: jose and Argon2 over jsonwebtoken and bcrypt

## Status
**Accepted** — 2026-03-05

## Context
The original implementation used `jsonwebtoken` for JWT operations and `bcryptjs` for password hashing. Both libraries have known issues:

| Library | Issue |
|---------|-------|
| `jsonwebtoken` | No ESM support. Relies on Node.js `crypto` internals that have changed across versions. Unmaintained (last publish 2022). |
| `bcryptjs` | Pure JS implementation is slow. Native `bcrypt` has platform-specific build issues on Alpine, ARM, and Windows. |

We also wanted to avoid libraries that require `reflect-metadata`, native addons with complex build chains, or CommonJS-only modules.

## Decision
We replaced both libraries with modern, actively maintained alternatives:

| Concern | Old | New | Rationale |
|---------|-----|-----|-----------|
| **JWT signing/verification** | `jsonwebtoken` | `jose` | ESM-native, Web Crypto API, zero dependencies, actively maintained |
| **Password hashing** | `bcryptjs` | `argon2` | OWASP-recommended, winner of the Password Hashing Competition, faster than bcrypt with better security margins |

### JWT (jose)

```typescript
import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(config.auth.jwtSecret);

// Sign
const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret);

// Verify
const { payload } = await jwtVerify(token, secret);
```

### Password Hashing (argon2)

```typescript
import * as argon2 from "argon2";

// Hash
const hash = await argon2.hash(password);

// Verify
const valid = await argon2.verify(hash, candidatePassword);
```

## Consequences

### Positive
- **Standards-compliant** — `jose` uses the Web Crypto API, aligning with browser and edge runtime compatibility.
- **Security** — Argon2id is the current OWASP recommendation for password hashing.
- **ESM-native** — Both libraries work with `"type": "module"` without wrappers or shims.
- **Zero native build issues** — `jose` has zero dependencies. `argon2` uses a pre-built binary via `@aspect/argon2`.

### Negative
- **Breaking change** — Existing password hashes generated with bcrypt are incompatible with argon2. A migration strategy is needed for production databases.
- **API differences** — `jose` uses a builder pattern (`new SignJWT().sign()`) vs. `jsonwebtoken`'s callback/promise API.

## References
- [jose on npm](https://www.npmjs.com/package/jose)
- [argon2 on npm](https://www.npmjs.com/package/argon2)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
