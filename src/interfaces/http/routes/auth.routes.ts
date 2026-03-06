import type { Router } from "express";
import type { AuthController } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema } from "../validators/auth.validators.js";

export function registerAuthRoutes(
	router: Router,
	controller: AuthController,
): void {
	router.post("/login", authLimiter, validate(loginSchema), controller.login);
}
