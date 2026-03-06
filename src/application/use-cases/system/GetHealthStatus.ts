export class GetHealthStatusUseCase {
    async execute() {
        return {
            status: "UP",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
}
