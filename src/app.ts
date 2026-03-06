import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import helmet from "helmet";
import { setupRoutes } from "./bootstrap/routes.js";
import { DomainError, NotFoundError } from "./domain/errors/DomainError.js";
import { requestLogger } from "./interfaces/http/middleware/log.middleware.js";
import { globalLimiter } from "./interfaces/http/middleware/rate-limit.middleware.js";
import { requestId } from "./interfaces/http/middleware/request-id.middleware.js";
import ApiResponse from "./utils/api-response.js";
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import { swaggerSpec } from "./utils/swagger.js";

const app = express();

// --- Security middleware (first) ---
app.use(helmet());
app.use(cors({ origin: config.app.corsOrigin }));
app.use(globalLimiter);

// --- Request lifecycle ---
app.use(requestId);
app.use(requestLogger);

// --- Body parsing ---
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// --- Routes ---
setupRoutes(app);

// --- API Documentation (Scalar) ---
app.use(
	"/api-docs",
	apiReference({
		theme: "deepSpace",
		spec: { content: swaggerSpec },
	} as Parameters<typeof apiReference>[0]),
);

// --- Root ---
app.get("/", (_req: Request, res: Response) => {
	res.status(200).json({
		message: "Enterprise Express is live!",
		timestamp: new Date().toISOString(),
	});
});

// --- 404 Handler ---
app.use((req: Request, _res: Response, next: NextFunction) => {
	next(new NotFoundError(`The route ${req.originalUrl}`));
});

// --- Global Error Handler ---
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof DomainError) {
		return res
			.status(err.statusCode)
			.json(ApiResponse.error(err.message, err.statusCode));
	}

	// Unexpected errors — log full stack, but don't expose to client
	logger.error({ err }, "Unhandled error");

	const details = config.app.env === "development" ? err.stack : null;
	return res
		.status(500)
		.json(ApiResponse.error("Internal Server Error", 500, details));
});

export default app;
