import type { Request, Response } from "express";
import type { SampleDataService } from "../services/sample-data.service.js";
import { BaseController } from "./base.controller.js";

export class SampleDataController extends BaseController {
	private sampleDataService: SampleDataService;

	constructor(sampleDataService: SampleDataService) {
		super();
		this.sampleDataService = sampleDataService;
	}

	// GET /sample-data
	getAll = async (_req: Request, res: Response): Promise<Response> => {
		const sampleData = await this.sampleDataService.getAll();
		return this.handleSuccess(res, sampleData);
	};

	// GET /sample-data/:id
	getById = async (req: Request, res: Response): Promise<Response> => {
		const id = req.params.id as string;
		const item = await this.sampleDataService.getById(id);
		if (!item) {
			return this.handleError(res, "Sample data not found", 404);
		}
		return this.handleSuccess(res, item);
	};

	// POST /sample-data
	create = async (req: Request, res: Response): Promise<Response> => {
		const { title, completed } = req.body;
		const newItem = await this.sampleDataService.create({ title, completed });
		return this.handleSuccess(
			res,
			newItem,
			"Sample data created successfully",
			201,
		);
	};

	// DELETE /sample-data/:id
	remove = async (
		req: Request,
		res: Response,
	): Promise<Response | undefined> => {
		const id = req.params.id as string;
		const success = await this.sampleDataService.delete(id);
		if (!success) {
			return this.handleError(res, "Sample data not found", 404);
		}
		return this.handleNoContent(res); // No Content
	};
}
