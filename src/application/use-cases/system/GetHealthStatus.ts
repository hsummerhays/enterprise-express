import db from "../../../infrastructure/database/sqlite.js";

export class GetHealthStatusUseCase {
    async execute() {
        let databaseStatus = "connected";
        try {
            db.prepare("SELECT 1").get();
        } catch (error) {
            databaseStatus = "disconnected";
        }

        return {
            status: "ok",
            uptime: process.uptime(),
            database: databaseStatus,
            timestamp: new Date().toISOString(),
        };
    }
}

