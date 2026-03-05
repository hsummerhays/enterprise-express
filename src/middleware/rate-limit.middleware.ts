import { rateLimit } from "express-rate-limit";
import ApiResponse from "../utils/api-response.js";

export const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per window
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: ApiResponse.error("Too many requests, please try again later.", 429),
});
