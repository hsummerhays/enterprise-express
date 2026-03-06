import type { Request, Response } from "express";
import type { HealthService } from "../../application/services/health.service.js";
import { BaseController } from "./base.controller.js";

export class HealthController extends BaseController {
	private healthService: HealthService;

	constructor(healthService: HealthService) {
		super();
		this.healthService = healthService;
	}

	getStatus = async (_req: Request, res: Response): Promise<Response> => {
		const data = await this.healthService.getSystemStatus();
		return this.handleSuccess(res, data, "System is healthy");
	};
}
