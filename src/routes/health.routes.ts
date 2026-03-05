import { type Request, type Response, Router } from "express";
import { HealthService } from "../services/health.service.js";
import ApiResponse from "../utils/api-response.js";

const router = Router();
const healthService = new HealthService();

router.get("/", async (_req: Request, res: Response) => {
	const data = await healthService.getSystemStatus();
	res.status(200).json(ApiResponse.success(data, "System is healthy"));
});

export default router;
