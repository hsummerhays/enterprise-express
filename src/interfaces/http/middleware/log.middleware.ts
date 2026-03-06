import type { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger.js";

export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const start = Date.now();
	res.on("finish", () => {
		const duration = Date.now() - start;
		const requestId = res.locals.requestId as string | undefined;
		logger.info({
			msg: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
			method: req.method,
			url: req.originalUrl,
			statusCode: res.statusCode,
			durationMs: duration,
			...(requestId && { requestId }),
		});
	});
	next();
};
