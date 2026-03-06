import type { Request, Response } from "express";
import type { GetHealthStatusUseCase } from "../../../application/use-cases/system/GetHealthStatus.js";
import { BaseController } from "./base.controller.js";

export class HealthController extends BaseController {
	constructor(private readonly getHealthStatusUseCase: GetHealthStatusUseCase) {
		super();
	}

	getStatus = async (_req: Request, res: Response): Promise<Response> => {
		const data = await this.getHealthStatusUseCase.execute();
		return this.handleSuccess(res, data, "System is healthy");
	};
}
