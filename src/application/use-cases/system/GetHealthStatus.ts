import type { DatabaseHealthPort } from "../../ports/DatabaseHealthPort.js";

export class GetHealthStatusUseCase {
	constructor(private readonly databaseHealth: DatabaseHealthPort) {}

	async execute() {
		const database = await this.databaseHealth.check();

		return {
			status: "ok",
			uptime: process.uptime(),
			database,
			timestamp: new Date().toISOString(),
		};
	}
}
