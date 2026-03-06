export interface DatabaseHealthPort {
	check(): Promise<"connected" | "disconnected">;
}
