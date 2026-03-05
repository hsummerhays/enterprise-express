export class HealthService {
    async getSystemStatus() {
        return {
            status: 'UP',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            node_version: process.version,
            platform: process.platform
        };
    }
}
