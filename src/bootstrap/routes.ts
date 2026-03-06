import { type Express, Router } from "express";
import { AuthController } from "../interfaces/http/controllers/auth.controller.js";
import { HealthController } from "../interfaces/http/controllers/health.controller.js";
import { SampleDataController } from "../interfaces/http/controllers/sample-data.controller.js";
import { UserController } from "../interfaces/http/controllers/user.controller.js";
import { registerAuthRoutes } from "../interfaces/http/routes/auth.routes.js";
import { registerHealthRoutes } from "../interfaces/http/routes/health.routes.js";
import { registerSampleDataRoutes } from "../interfaces/http/routes/sample-data.routes.js";
import { registerUserRoutes } from "../interfaces/http/routes/user.routes.js";
import { container } from "./container.js";

/**
 * Wires all controllers to their routes and mounts them on the Express app.
 * This is the single place where the interfaces layer connects to the framework.
 */
export function setupRoutes(app: Express): void {
	const authRouter = Router();
	registerAuthRoutes(
		authRouter,
		container.resolve<AuthController>(AuthController),
	);
	app.use("/auth", authRouter);

	const healthRouter = Router();
	registerHealthRoutes(
		healthRouter,
		container.resolve<HealthController>(HealthController),
	);
	app.use("/health", healthRouter);

	const userRouter = Router();
	registerUserRoutes(
		userRouter,
		container.resolve<UserController>(UserController),
	);
	app.use("/users", userRouter);

	const sampleDataRouter = Router();
	registerSampleDataRoutes(
		sampleDataRouter,
		container.resolve<SampleDataController>(SampleDataController),
	);
	app.use("/sample-data", sampleDataRouter);
}
