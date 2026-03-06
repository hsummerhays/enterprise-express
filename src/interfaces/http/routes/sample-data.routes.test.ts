import { SignJWT } from "jose";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import app from "../../../app.js";
import config from "../../../utils/config.js";

describe("Sample Data Routes API (Integration)", () => {
	let authToken: string;

	beforeAll(async () => {
		const secret = new TextEncoder().encode(config.auth.jwtSecret);
		const token = await new SignJWT({ id: 1, role: "admin" })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1h")
			.sign(secret);
		authToken = `Bearer ${token}`;
	});

	it("GET /sample-data should return all sample data", async () => {
		const response = await request(app).get("/sample-data");

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(Array.isArray(response.body.data)).toBe(true);
	});

	it("POST /sample-data should create a new item successfully", async () => {
		const payload = { title: "Test new task", completed: false };
		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
				request(app as any)
					.post("/sample-data")
					.set("Authorization", authToken)
					.send(payload);

		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body.data.title).toBe("Test new task");
	});

	it("POST /sample-data should return 400 when validation fails (missing title)", async () => {
		const payload = { completed: true }; // Missing required title
		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
				request(app as any)
					.post("/sample-data")
					.set("Authorization", authToken)
					.send(payload);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Validation failed");
	});

	it("DELETE /sample-data/:id should remove an item and return 204", async () => {
		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
				request(app as any)
					.delete("/sample-data/1")
					.set("Authorization", authToken);
		expect(response.status).toBe(204);
	});

	it("DELETE /sample-data/:id should return 404 for a non-existent item", async () => {
		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
				request(app as any)
					.delete("/sample-data/9999")
					.set("Authorization", authToken);
		expect(response.status).toBe(404);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Sample Data not found");
	});
});
