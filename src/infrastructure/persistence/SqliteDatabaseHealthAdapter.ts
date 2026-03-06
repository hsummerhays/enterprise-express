import type { DatabaseHealthPort } from "../../application/ports/DatabaseHealthPort.js";
import db from "../database/sqlite.js";

export class SqliteDatabaseHealthAdapter implements DatabaseHealthPort {
	async check(): Promise<"connected" | "disconnected"> {
		try {
			db.prepare("SELECT 1").get();
			return "connected";
		} catch {
			return "disconnected";
		}
	}
}
