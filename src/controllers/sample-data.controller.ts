import type { Request, Response } from "express";
import type { SampleDataService } from "../services/sample-data.service.js";
import ApiResponse from "../utils/api-response.js";

export class SampleDataController {
	private sampleDataService: SampleDataService;

	constructor(sampleDataService: SampleDataService) {
		this.sampleDataService = sampleDataService;
	}

	// GET /sample-data
	getAll = async (_req: Request, res: Response): Promise<Response> => {
		const sampleData = await this.sampleDataService.getAll();
		return res.status(200).json(ApiResponse.success(sampleData));
	};

	// GET /sample-data/:id
	getById = async (req: Request, res: Response): Promise<Response> => {
		const id = req.params.id as string;
		const item = await this.sampleDataService.getById(id);
		if (!item) {
			return res
				.status(404)
				.json(ApiResponse.error("Sample data not found", 404));
		}
		return res.status(200).json(ApiResponse.success(item));
	};

	// POST /sample-data
	create = async (req: Request, res: Response): Promise<Response> => {
		const { title, completed } = req.body;
		const newItem = await this.sampleDataService.create({ title, completed });
		return res
			.status(201)
			.json(ApiResponse.success(newItem, "Sample data created successfully"));
	};

	// DELETE /sample-data/:id
	remove = async (
		req: Request,
		res: Response,
	): Promise<Response | undefined> => {
		const id = req.params.id as string;
		const success = await this.sampleDataService.delete(id);
		if (!success) {
			return res
				.status(404)
				.json(ApiResponse.error("Sample data not found", 404));
		}
		return res.status(204).send(); // No Content
	};
}
