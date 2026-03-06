import config from "../utils/config.js";

export interface SystemStatus {
	status: string;
	uptime: number;
	timestamp: string;
	environment: string;
	node_version: string;
	platform: string;
}

export class HealthService {
	async getSystemStatus(): Promise<SystemStatus> {
		return {
			status: "UP",
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
			environment: config.app.env,
			node_version: process.version,
			platform: process.platform,
		};
	}
}
