# ⚙️ Configuration Management Guide

This project validates all configuration directly from `process.env` using **Zod** — no extra config libraries needed.

---

## 1. How It Works

All configuration is read from environment variables, validated and typed on startup:

```typescript
// src/utils/config.ts
const rawConfig = {
    app: { port: process.env.PORT, env: process.env.NODE_ENV, corsOrigin: process.env.CORS_ORIGIN },
    logging: { level: process.env.LOG_LEVEL },
    auth: { jwtSecret: process.env.JWT_SECRET },
};

const config = configSchema.parse(rawConfig);
```

The Zod schema handles **defaults**, **coercion** (e.g., `PORT` string → number), and **validation** (e.g., `JWT_SECRET` must be a non-empty string).

---

## 2. Environment Variables & `.env`

This project uses **Node.js 24+ native environment file support**. Variables are loaded via the `--env-file` flag in `package.json`:

```bash
# Example from package.json
tsx watch --env-file=.env src/server.ts
```

### Available Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment name |
| `LOG_LEVEL` | No | `info` | Pino log level (`debug`, `info`, `warn`, `error`) |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origin. Set to your frontend URL in production (e.g., `https://yourdomain.com`) |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWTs |

---

## 3. Type-Safe Access

Import the validated configuration object from `src/utils/config.ts`:

```typescript
import config from './utils/config.js';

const port = config.app.port;           // number (auto-coerced from string)
const env = config.app.env;             // string
const corsOrigin = config.app.corsOrigin; // string (defaults to '*')
const level = config.logging.level;     // 'debug' | 'info' | 'warn' | 'error'
```

Full TypeScript autocomplete and type safety is provided via `z.infer`.

---

## 4. The "Fail-Fast" Mechanism

On application startup, the config module uses `safeParse` to validate the merged environment. If a required value is missing or invalid, the application exits immediately with a descriptive error:

```
❌ Configuration validation failed: [
  { expected: 'string', code: 'invalid_type', path: ['auth', 'jwtSecret'], message: 'JWT_SECRET is required' }
]
```

---

## 5. Maintenance

### Adding New Config Keys
1. Add the variable to `.env.example` (and your local `.env`).
2. Update the `configSchema` Zod schema in `src/utils/config.ts` with the new field, default, and type.
3. Update the `rawConfig` object in the same file to read from `process.env`.

### For Tests
Test-specific environment values are provided in `vitest.config.ts`:

```typescript
export default defineConfig({
    test: {
        env: {
            JWT_SECRET: "test-secret-for-vitest",
            NODE_ENV: "test",
        },
    },
});
```

### Troubleshooting
If the app fails to start with a "Configuration validation failed" error, check your `.env` file against the variable table above and the schema in `src/utils/config.ts`.
