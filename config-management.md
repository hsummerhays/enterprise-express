# ⚙️ Configuration Management Guide

This project utilizes the `config` library (node-config) paired with **Zod** to manage and validate type-safe, environment-specific settings.

---

## 1. Multi-Layer Hierarchy

The configuration system follows a hierarchical merge strategy to ensure flexibility across development, testing, and production.

1.  **`config/default.json`**: The base structure and common values shared across all environments.
2.  **`config/{NODE_ENV}.json`**: (e.g., `production.json`, `development.json`) Overrides the base values for specific environments.
3.  **`config/custom-environment-variables.json`**: Maps system environment variables (from `.env` or the OS) to specific configuration keys. This is critical for **Secrets** (like JWT keys).

---

## 2. Environment Variables & `.env`

While structural config lives in JSON files, **Secrets and machine-specific overrides** live in the `.env` file. 

This project uses **Node.js 24+ native environment file support**. We load variables via the `--env-file` flag in `package.json`:

```bash
# Example from package.json
tsx watch --env-file=.env src/server.ts
```

### Mapping Example
To link a variable like `JWT_SECRET` to the app config, it is registered in `custom-environment-variables.json`:

```json
{
  "auth": {
    "jwtSecret": "JWT_SECRET"
  }
}
```

---

## 3. Type-Safe Access & Validation

Instead of directly accessing `process.env`, always import the validated configuration from `src/utils/config.ts`. 

### The "Fail-Fast" Mechanism
On application startup, the system validates the merged configuration against a **Zod schema**. If a required value (like a secret) is missing or has the wrong type, the application will exit immediately with a descriptive error.

```typescript
import config from '#utils/config';

const port = config.app.port; // Autocomplete and type safety included
```

---

## 4. Maintenance

### Adding New Config Keys
1.  Add the key and a default value to `config/default.json`.
2.  Update the `configSchema` in `src/utils/config.ts` to include the new key.
3.  (Optional) Add a mapping in `custom-environment-variables.json` if it should be overridable via `.env`.

### Troubleshooting
If the app fails to start with a "Configuration validation failed" error, check your `.env` file against the schema requirements defined in `src/utils/config.ts`.
