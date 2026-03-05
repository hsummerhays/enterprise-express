import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import type { JwtPayload } from "../types/auth.types.js";
import ApiResponse from "../utils/api-response.js";
import config from "../utils/config.js";

export interface AuthenticatedRequest extends Request {
	user?: JwtPayload;
}

const jwtSecret = new TextEncoder().encode(config.auth.jwtSecret);

/**
 * Middleware to authenticate requests using a Bearer Token (JWT).
 */
export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json(
				ApiResponse.error(
					"Authentication required. Missing Bearer token.",
					401,
				),
			);
	}

	const token = authHeader.split(" ")[1];

	try {
		const { payload } = await jwtVerify(token, jwtSecret);
		(req as AuthenticatedRequest).user = payload as unknown as JwtPayload;
		next();
	} catch (error: unknown) {
		const isExpired =
			error instanceof Error && error.message.includes("expired");
		const message = isExpired
			? "Token has expired."
			: "Invalid or expired token.";
		return res.status(401).json(ApiResponse.error(message, 401));
	}
};
