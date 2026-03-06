import { rateLimit } from "express-rate-limit";
import ApiResponse from "../../utils/api-response.js";

/**
 * General rate limiter for all routes.
 */
export const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per window
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: ApiResponse.error("Too many requests, please try again later.", 429),
});

/**
 * Strict rate limiter for authentication endpoints (brute-force protection).
 */
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Only 5 login attempts per window
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: ApiResponse.error(
		"Too many login attempts, please try again later.",
		429,
	),
});
