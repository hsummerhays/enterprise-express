import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import ApiResponse from "../utils/api-response.js";

export const validate =
	(schema: ZodTypeAny) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			return next();
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				return res
					.status(400)
					.json(ApiResponse.error("Validation failed", 400, error.issues));
			}
			const message =
				error instanceof Error ? error.message : "Validation failed";
			return res.status(400).json(ApiResponse.error(message, 400));
		}
	};
