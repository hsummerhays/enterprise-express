import { SignJWT } from "jose";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import app from "../../../app.js";
import config from "../../../utils/config.js";

describe("User Routes API (Integration)", () => {
	let authToken: string;

	beforeAll(async () => {
		const secret = new TextEncoder().encode(config.auth.jwtSecret);
		const token = await new SignJWT({ id: 1, role: "admin" })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1h")
			.sign(secret);
		authToken = `Bearer ${token}`;
	});

	it("GET /users should return all users", async () => {
		const response = await request(app).get("/users");

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(Array.isArray(response.body.data)).toBe(true);
	});

	it("GET /users/:id should return a user if it exists", async () => {
		// Assuming ID 1 exists (admin from default seed in AuthRepository or UserRepository)
		const response = await request(app).get("/users/1");

		if (response.status === 200) {
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("id", 1);
		} else {
			expect(response.status).toBe(404);
		}
	});

	it("POST /users should create a new user successfully", async () => {
		const payload = {
			name: "Integration Test User",
			email: "integration-test@example.com",
		};

		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
				request(app as any)
					.post("/users")
					.set("Authorization", authToken)
					.send(payload);

		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body.data.name).toBe(payload.name);
		expect(response.body.data.email).toBe(payload.email);
	});

	it("POST /users should return 400 for duplicate email", async () => {
		const payload = {
			name: "Duplicate User",
			email: "duplicate@example.com",
		};

		// 1. Create the user once
		await request(app as any)
			.post("/users")
			.set("Authorization", authToken)
			.send(payload);

		// 2. Attempt to create again
		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
				request(app as any)
					.post("/users")
					.set("Authorization", authToken)
					.send(payload);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toContain("User already exists with email");
	});

	it("DELETE /users/:id should remove a user", async () => {
		// Create a user first to delete it
		const createRes =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
				request(app as any)
					.post("/users")
					.set("Authorization", authToken)
					.send({ name: "To Delete", email: "delete-me@example.com" });

		const userId = createRes.body.data.id;

		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
				request(app as any)
					.delete(`/users/${userId}`)
					.set("Authorization", authToken);

		expect(response.status).toBe(204);
	});
});
