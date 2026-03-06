import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/**
 * Assigns a unique request ID to every incoming request for traceability.
 * Uses the client-provided X-Request-Id header if present, otherwise generates one.
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
	const id = (req.headers["x-request-id"] as string) || crypto.randomUUID();
	res.setHeader("X-Request-Id", id);
	res.locals.requestId = id;
	next();
};
