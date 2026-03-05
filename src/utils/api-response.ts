/**
 * Standardized API Response Helper
 */
/**
 * Standardized API Response Helper
 */
export const ApiResponse = {
	/**
	 * Success Response
	 */
	success<T>(data: T, message: string = "Success") {
		return {
			success: true as const,
			message,
			data,
		};
	},

	/**
	 * Error Response
	 */
	error(message: string, code: number = 500, details: unknown = null) {
		return {
			success: false as const,
			message,
			error: {
				code,
				details,
			},
		};
	},
};

export default ApiResponse;
