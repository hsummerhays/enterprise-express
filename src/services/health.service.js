/**
 * Using a Class feels more like C#/Java and 
 * provides a clean namespace for related logic.
 */
class HealthService {
    async getSystemStatus() {
        // In the future, this is where you'd check your MSSQL connection
        return {
            status: 'UP',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
        };
    }
}

// Export a singleton instance
export const healthService = new HealthService();