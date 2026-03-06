import { z } from "zod";
import { registry } from "../../../utils/openapi-registry.js";

registry.register(
	"LoginRequest",
	z.object({
		email: z.string().email(),
		password: z.string().min(6),
	}),
);

registry.registerPath({
	method: "post",
	path: "/auth/login",
	summary: "Authenticate user and receive JWT",
	description:
		"Use the following credentials for testing: admin@example.com / P@ssword123",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: { $ref: "#/components/schemas/LoginRequest" },
				},
			},
		},
	},
	responses: {
		200: {
			description: "Login successful",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							success: { type: "boolean" },
							data: {
								type: "object",
								properties: {
									user: { type: "object" },
									token: { type: "string" },
								},
							},
						},
					},
				},
			},
		},
		401: { description: "Authentication failed" },
	},
});
