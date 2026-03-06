import { z } from "zod";
import { registry } from "../../../utils/openapi-registry.js";

registry.register(
	"CreateUserRequest",
	z.object({
		name: z.string().min(1),
		email: z.string().email(),
		password: z.string().min(8),
	}),
);

registry.register(
	"UserResponse",
	z.object({
		id: z.number(),
		name: z.string(),
		email: z.string(),
		role: z.string(),
		createdAt: z.string(),
	}),
);

registry.registerPath({
	method: "post",
	path: "/users",
	summary: "Create a new user",
	tags: ["Users"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: { $ref: "#/components/schemas/CreateUserRequest" },
				},
			},
		},
	},
	responses: {
		201: {
			description: "User created successfully",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							success: { type: "boolean" },
							data: { $ref: "#/components/schemas/UserResponse" },
						},
					},
				},
			},
		},
		400: { description: "Validation error or email already exists" },
		401: { description: "Unauthorized" },
	},
});
