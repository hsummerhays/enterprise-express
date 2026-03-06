import { registry } from "../../../utils/openapi-registry.js";

registry.registerPath({
	method: "get",
	path: "/health",
	summary: "System health check",
	tags: ["System"],
	responses: {
		200: {
			description: "Returns the current system status",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							status: { type: "string", example: "ok" },
							uptime: { type: "number", example: 123.45 },
							database: { type: "string", example: "connected" },
							timestamp: { type: "string", example: "2026-03-06T18:15:00Z" },
						},
					},
				},
			},
		},
	},
});
