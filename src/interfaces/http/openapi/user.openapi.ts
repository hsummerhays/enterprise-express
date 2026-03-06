import { z } from "zod";
import { registry } from "../../../utils/openapi-registry.js";

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
