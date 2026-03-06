import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi-registry.js";

// Import OpenAPI definitions — side effects register paths and schemas
import "../interfaces/http/openapi/auth.openapi.js";
import "../interfaces/http/openapi/health.openapi.js";
import "../interfaces/http/openapi/sample-data.openapi.js";
import "../interfaces/http/openapi/user.openapi.js";

registry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
});

const openApiConfig = {
	openapi: "3.0.0",
	info: {
		title: "WSL-Native Express Backend API",
		version: "1.0.0",
		description:
			"A modern Express 5 API documentation powered by Zod and OpenAPI Registry",
	},
	servers: [
		{ url: "http://localhost:3000", description: "Local development server" },
	],
};

export const swaggerSpec = new OpenApiGeneratorV3(
	registry.definitions,
).generateDocument(openApiConfig);
