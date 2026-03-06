import type { Response } from "express";
import ApiResponse from "../../utils/api-response.js";
import logger from "../../utils/logger.js";

/**
 * Base Controller providing standard response formatting.
 */
export abstract class BaseController {
	/**
	 * Send a standardized success response.
	 */
	protected handleSuccess<T>(
		res: Response,
		data: T,
		message = "Success",
		statusCode = 200,
	): Response {
		return res.status(statusCode).json(ApiResponse.success(data, message));
	}

	/**
	 * Send a standardized error response.
	 * (Note: Use throw AppError for global error handling instead when appropriate).
	 */
	protected handleError(
		res: Response,
		message: string,
		statusCode = 500,
		details: unknown = null,
	): Response {
		if (statusCode >= 500) {
			logger.error(
				{ err: details },
				`[BaseController] Internal Error: ${message}`,
			);
		}
		return res
			.status(statusCode)
			.json(ApiResponse.error(message, statusCode, details));
	}

	/**
	 * Send a 204 No Content response.
	 */
	protected handleNoContent(res: Response): Response {
		return res.status(204).send();
	}
}
