/**
 * Standardized API Response Helper
 */
class ApiResponse {
    /**
     * Success Response
     */
    static success(data, message = 'Operation successful') {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        };
    }
    /**
     * Error Response
     */
    static error(message, code = 500, details = null) {
        return {
            success: false,
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
