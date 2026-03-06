import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { UnauthorizedError } from "../../../domain/errors/DomainError.js";
import type { JwtPayload } from "../../../types/auth.types.js";
import config from "../../../utils/config.js";

export interface AuthenticatedRequest extends Request {
	user?: JwtPayload;
}

const jwtSecret = new TextEncoder().encode(config.auth.jwtSecret);

/**
 * Middleware to authenticate requests using a Bearer Token (JWT).
 * Throws UnauthorizedError so the global error handler formats the response.
 */
export const authenticate = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthorizedError(
			"Authentication required. Missing Bearer token.",
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
		throw new UnauthorizedError(message);
	}
};
