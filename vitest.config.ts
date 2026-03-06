import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: [
            "tests/unit/**/*.test.ts",
            "tests/integration/**/*.test.ts",
            "tests/e2e/**/*.test.ts",
        ],
        env: {
            JWT_SECRET: "test-secret-for-vitest",
            NODE_ENV: "test",
            PORT: "3000",
        },
    },
});
