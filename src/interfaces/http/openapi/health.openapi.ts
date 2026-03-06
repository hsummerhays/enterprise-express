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
					schema: { type: "object" },
				},
			},
		},
	},
});
