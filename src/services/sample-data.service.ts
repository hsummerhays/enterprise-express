import type { SampleDataRepository } from "../repositories/sample-data.repository.js";
import type {
	CreateSampleDataRequest,
	SampleData,
} from "../schemas/sample-data.schema.js";

export class SampleDataService {
	private readonly repository: SampleDataRepository;

	constructor(repository: SampleDataRepository) {
		this.repository = repository;
	}

	async getAll(): Promise<SampleData[]> {
		return this.repository.findAll();
	}

	async getById(id: string): Promise<SampleData | undefined> {
		return this.repository.findById(parseInt(id, 10));
	}

	async create(data: CreateSampleDataRequest): Promise<SampleData> {
		return this.repository.create(data);
	}

	async delete(id: string): Promise<boolean> {
		return this.repository.delete(parseInt(id, 10));
	}
}
