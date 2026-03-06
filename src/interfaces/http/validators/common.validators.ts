import { z } from "zod";

export const idParamSchema = z.object({
	params: z.object({
		id: z.string().regex(/^\d+$/, "ID must be a numeric value"),
	}),
});
