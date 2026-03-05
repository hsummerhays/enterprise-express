import { Request, Response } from 'express';
import { SampleDataService } from '../services/sample-data.service.js';

export class SampleDataController {
    private sampleDataService: SampleDataService;

    constructor(sampleDataService: SampleDataService) {
        this.sampleDataService = sampleDataService;
    }

    // GET /sample-data
    getAll = async (req: Request, res: Response): Promise<Response> => {
        const sampleData = await this.sampleDataService.getAll();
        return res.status(200).json((res.locals as any).ApiResponse.success(sampleData));
    };

    // GET /sample-data/:id
    getById = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const item = await this.sampleDataService.getById(id);
        if (!item) {
            return res.status(404).json((res.locals as any).ApiResponse.error('Sample data not found', 404));
        }
        return res.status(200).json((res.locals as any).ApiResponse.success(item));
    };

    // POST /sample-data
    create = async (req: Request, res: Response): Promise<Response> => {
        const { title, completed } = req.body;
        const newItem = await this.sampleDataService.create({ title, completed });
        return res.status(201).json((res.locals as any).ApiResponse.success(newItem, 'Sample data created successfully'));
    };

    // DELETE /sample-data/:id
    remove = async (req: Request, res: Response): Promise<Response | void> => {
        const id = req.params.id as string;
        const success = await this.sampleDataService.delete(id);
        if (!success) {
            return res.status(404).json((res.locals as any).ApiResponse.error('Sample data not found', 404));
        }
        return res.status(204).send(); // No Content
    };
}
