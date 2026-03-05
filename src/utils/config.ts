import { z } from "zod";

const configSchema = z.object({
	app: z.object({
		port: z
			.string()
			.default("3000")
			.transform((v) => Number.parseInt(v, 10))
			.pipe(z.number().int().nonnegative()),
		env: z.string().min(1).default("development"),
	}),
	logging: z.object({
		level: z.enum(["debug", "info", "warn", "error"]).default("info"),
	}),
	auth: z.object({
		jwtSecret: z.string().min(1, "JWT_SECRET is required"),
	}),
});

export type Config = z.infer<typeof configSchema>;

export const validateConfig = (): Config => {
	const rawConfig = {
		app: {
			port: process.env.PORT,
			env: process.env.NODE_ENV,
		},
		logging: {
			level: process.env.LOG_LEVEL,
		},
		auth: {
			jwtSecret: process.env.JWT_SECRET,
		},
	};

	const result = configSchema.safeParse(rawConfig);

	if (!result.success) {
		console.error("❌ Configuration validation failed:", result.error.issues);
		process.exit(1);
	}

	return result.data;
};

const config = validateConfig();
export default config;
