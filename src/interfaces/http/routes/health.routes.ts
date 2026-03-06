import { Router } from "express";
import type { HealthController } from "../controllers/health.controller.js";

export function registerHealthRoutes(
	router: Router,
	controller: HealthController,
): void {
	router.get("/", controller.getStatus);
}
