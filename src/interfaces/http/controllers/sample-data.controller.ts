import type { Request, Response } from "express";
import type { GetAllSampleDataUseCase } from "../../../application/use-cases/sample-data/GetAllSampleData.js";
import type { GetSampleDataByIdUseCase } from "../../../application/use-cases/sample-data/GetSampleDataById.js";
import type { CreateSampleDataUseCase } from "../../../application/use-cases/sample-data/CreateSampleData.js";
import type { DeleteSampleDataUseCase } from "../../../application/use-cases/sample-data/DeleteSampleData.js";
import { BaseController } from "./base.controller.js";

export class SampleDataController extends BaseController {
	constructor(
		private readonly getAllSampleDataUseCase: GetAllSampleDataUseCase,
		private readonly getSampleDataByIdUseCase: GetSampleDataByIdUseCase,
		private readonly createSampleDataUseCase: CreateSampleDataUseCase,
		private readonly deleteSampleDataUseCase: DeleteSampleDataUseCase,
	) {
		super();
	}

	getAll = async (_req: Request, res: Response): Promise<Response> => {
		const sampleData = await this.getAllSampleDataUseCase.execute();
		return this.handleSuccess(res, sampleData);
	};

	getById = async (req: Request, res: Response): Promise<Response> => {
		const id = Number(req.params.id);
		const item = await this.getSampleDataByIdUseCase.execute(id);
		return this.handleSuccess(res, item);
	};

	create = async (req: Request, res: Response): Promise<Response> => {
		const newItem = await this.createSampleDataUseCase.execute(req.body);
		return this.handleSuccess(
			res,
			newItem,
			"Sample data created successfully",
			201,
		);
	};

	remove = async (
		req: Request,
		res: Response,
	): Promise<Response | undefined> => {
		const id = Number(req.params.id);
		await this.deleteSampleDataUseCase.execute(id);
		return this.handleNoContent(res);
	};
}
