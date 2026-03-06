import { z } from "zod";
import { registry } from "../../../utils/openapi-registry.js";

registry.register(
	"SampleData",
	z.object({
		id: z.number().openapi({ example: 1 }),
		title: z.string().openapi({ example: "Example Task" }),
		completed: z.boolean().openapi({ example: false }),
	}),
);

registry.registerPath({
	method: "get",
	path: "/sample-data",
	summary: "Retrieve all sample data",
	tags: ["SampleData"],
	responses: {
		200: {
			description: "A list of sample data items",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: { $ref: "#/components/schemas/SampleData" },
					},
				},
			},
		},
	},
});

registry.registerPath({
	method: "post",
	path: "/sample-data",
	summary: "Create a new sample data item",
	tags: ["SampleData"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: {
						type: "object",
						required: ["title"],
						properties: {
							title: { type: "string", example: "New Task Title" },
							completed: { type: "boolean", example: false },
						},
					},
				},
			},
		},
	},
	responses: {
		201: { description: "Successfully created" },
		400: { description: "Validation failed" },
	},
});

registry.registerPath({
	method: "delete",
	path: "/sample-data/{id}",
	summary: "Delete a sample data item",
	tags: ["SampleData"],
	security: [{ bearerAuth: [] }],
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			schema: { type: "string" },
		},
	],
	responses: {
		204: { description: "Successfully deleted" },
		404: { description: "Item not found" },
	},
});
