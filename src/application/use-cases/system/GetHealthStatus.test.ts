import { describe, it, expect, vi } from "vitest";
import { GetHealthStatusUseCase } from "./GetHealthStatus.js";

describe("GetHealthStatusUseCase", () => {
    it("should return system health info including database status", async () => {
        const useCase = new GetHealthStatusUseCase();
        const result = await useCase.execute();

        expect(result.status).toBe("ok");
        expect(result.database).toBe("connected");
        expect(result.uptime).toBeGreaterThan(0);
        expect(result.timestamp).toBeDefined();
    });
});
