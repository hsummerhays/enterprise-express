import type { DatabaseHealthPort } from "../../application/ports/DatabaseHealthPort.js";

export class InMemoryDatabaseHealthAdapter implements DatabaseHealthPort {
	async check(): Promise<"connected" | "disconnected"> {
		return "connected";
	}
}
