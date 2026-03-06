import { z } from "zod";

export const createUserSchema = z.object({
	body: z.object({
		name: z.string().min(1, "Name is required"),
		email: z.string().email("Invalid email"),
		password: z.string().min(8, "Password must be at least 8 characters"),
	}),
});
