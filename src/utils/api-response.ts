/**
 * Standardized API Response Helper
 */
class ApiResponse {
    /**
     * Success Response
     */
    static success<T>(data: T, message: string = 'Operation successful') {
        return {
            success: true as const,
            message,
            data,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Error Response
     */
    static error(message: string, code: number = 500, details: any = null) {
        return {
            success: false as const,
            message,
            error: {
                code,
                details
            },
            timestamp: new Date().toISOString()
        };
    }
}

export default ApiResponse;
