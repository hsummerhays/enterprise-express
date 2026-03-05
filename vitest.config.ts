import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        env: {
            JWT_SECRET: "test-secret-for-vitest",
            NODE_ENV: "test",
            PORT: "3000",
        },
    },
});
