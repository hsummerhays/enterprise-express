import { z } from "zod";

export const createSampleDataSchema = z.object({
	body: z.object({
		title: z.string().min(1, "Title is required"),
		completed: z.boolean().optional(),
	}),
});
