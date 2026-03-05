import { describe, expect, it } from "vitest";
import { SampleDataService } from "./sample-data.service.js";

describe("SampleDataService", () => {
	const service = new SampleDataService();

	it("should return all sample data items", async () => {
		const data = await service.getAll();
		expect(Array.isArray(data)).toBe(true);
		expect(data.length).toBeGreaterThan(0);
	});

	it("should return an item by ID", async () => {
		const item = await service.getById("1");
		expect(item).toBeDefined();
		expect(item?.id).toBe(1);
	});

	it("should create a new item", async () => {
		const payload = { title: "Test Task" };
		const newItem = await service.create(payload);
		expect(newItem).toHaveProperty("id");
		expect(newItem.title).toBe("Test Task");
		expect(newItem.completed).toBe(false);
	});

	it("should delete an item", async () => {
		// Create an item first to be safe or use existing ID 1
		const success = await service.delete("1");
		expect(success).toBe(true);

		const item = await service.getById("1");
		expect(item).toBeUndefined();
	});

	it("should return false when deleting non-existent item", async () => {
		const success = await service.delete("9999");
		expect(success).toBe(false);
	});
});
