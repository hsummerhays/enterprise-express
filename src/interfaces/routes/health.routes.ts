import { Router } from "express";
import { HealthController } from "../controllers/health.controller.js";
import { HealthService } from "../../application/services/health.service.js";

const router = Router();

// Orchestrate Dependencies
const healthService = new HealthService();
const healthController = new HealthController(healthService);

router.get("/", healthController.getStatus);

export default router;
