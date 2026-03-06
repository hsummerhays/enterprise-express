import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app.js";

describe("Auth Routes API (Integration)", () => {
	it("POST /auth/login should authenticate valid credentials", async () => {
		const payload = {
			email: "admin@example.com",
			password: "P@ssword123",
		};

		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
			request(app as any)
				.post("/auth/login")
				.send(payload);

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveProperty("token");
		expect(response.body.data.user.email).toBe("admin@example.com");
	});

	it("POST /auth/login should reject invalid credentials", async () => {
		const payload = {
			email: "wrong@example.com",
			password: "incorrect-password",
		};

		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
			request(app as any)
				.post("/auth/login")
				.send(payload);

		expect(response.status).toBe(401);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Invalid email or password");
	});

	it("POST /auth/login should return 400 for invalid email format", async () => {
		const payload = {
			email: "not-an-email",
			password: "P@ssword123",
		};

		const response =
			await // biome-ignore lint/suspicious/noExplicitAny: Express 5 + supertest type mismatch
			request(app as any)
				.post("/auth/login")
				.send(payload);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("Validation failed");
	});
});
