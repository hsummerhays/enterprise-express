import { describe, expect, it, vi } from "vitest";
import type { DatabaseHealthPort } from "../../../src/application/ports/DatabaseHealthPort.js";
import { GetHealthStatusUseCase } from "../../../src/application/use-cases/system/GetHealthStatus.js";

describe("GetHealthStatusUseCase", () => {
	it("should return ok status with connected database", async () => {
		const databaseHealth: DatabaseHealthPort = {
			check: vi.fn().mockResolvedValue("connected"),
		};
		const useCase = new GetHealthStatusUseCase(databaseHealth);
		const result = await useCase.execute();

		expect(result.status).toBe("ok");
		expect(result.database).toBe("connected");
		expect(result.uptime).toBeGreaterThan(0);
		expect(result.timestamp).toBeDefined();
	});

	it("should report disconnected status when database is unavailable", async () => {
		const databaseHealth: DatabaseHealthPort = {
			check: vi.fn().mockResolvedValue("disconnected"),
		};
		const useCase = new GetHealthStatusUseCase(databaseHealth);
		const result = await useCase.execute();

		expect(result.status).toBe("ok");
		expect(result.database).toBe("disconnected");
	});
});
