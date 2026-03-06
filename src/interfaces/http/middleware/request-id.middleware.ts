import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/**
 * Assigns a unique request ID to every incoming request for traceability.
 * Propagates the X-Request-Id header when present — intended for deployments
 * behind a trusted API gateway or load balancer that sets this header.
 * If deployed directly to the internet without a gateway, remove the header
 * propagation and always generate a fresh UUID to prevent client log injection.
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
	const id = (req.headers["x-request-id"] as string) || crypto.randomUUID();
	res.setHeader("X-Request-Id", id);
	res.locals.requestId = id;
	next();
};
