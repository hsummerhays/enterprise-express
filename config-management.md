# ⚙️ Configuration Management Guide

This project utilizes the `config` library paired with **Zod** to manage and validate environment-specific settings.

---

## 1. How it Works

The `config` library loads configurations from the `./config/` directory based on the current `NODE_ENV`. It follows a hierarchical merge strategy:

1.  **`default.json`**: Base configuration shared across all environments.
2.  **`{NODE_ENV}.json`**: (e.g., `production.json`, `development.json`) Overrides the base values for that specific environment.
3.  **`custom-environment-variables.json`**: Maps specific system environment variables (like `PORT`) to configuration keys.

---

## 2. Using Configuration in Code

Instead of directly accessing `process.env.VARIABLE`, you should import and use the validated configuration from `src/utils/config.js`:

```javascript
import config from './utils/config.js';

const port = config.app.port;
```

---

## 3. Configuration Validation (Startup Check)

The project includes a startup validation step in `src/utils/config.js` using Zod. This ensures that the application **fails fast** if any required configuration is missing or invalid.

### Updating the Schema
If you add new config keys, you must update the Zod schema in `src/utils/config.js`:

```javascript
const configSchema = z.object({
  app: z.object({
    port: z.number().int(),
    env: z.string()
  }),
  // Add new sections here
});
```

---

## 4. Environment Variables Mapping

To map an environment variable to a config key, update `config/custom-environment-variables.json`:

```json
{
  "app": {
    "port": "PORT"
  }
}
```
*Note: In the example above, the value of the `PORT` environment variable will override `app.port` during runtime.*

---

## 5. Adding a New Environment

To add a new environment (e.g., `staging`):

1.  Create `config/staging.json`.
2.  Set `NODE_ENV=staging` before running the app.
3.  The values in `staging.json` will merge over `default.json`.
