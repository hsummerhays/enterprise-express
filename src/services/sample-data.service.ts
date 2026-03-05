import type {
	CreateSampleDataRequest,
	SampleData,
} from "../schemas/sample-data.schema.js";

export class SampleDataService {
	private sampleData: SampleData[];
	private nextId: number = 3; // Starts after seed data

	constructor() {
		// Our in-memory "Database"
		this.sampleData = [
			{ id: 1, title: "Learn Express 5", completed: true },
			{ id: 2, title: "Configure Antigravity WSL", completed: false },
		];
	}

	async getAll(): Promise<SampleData[]> {
		return this.sampleData;
	}

	async getById(id: string): Promise<SampleData | undefined> {
		return this.sampleData.find((t) => t.id === parseInt(id, 10));
	}

	async create(data: CreateSampleDataRequest): Promise<SampleData> {
		const newItem: SampleData = {
			id: this.nextId++, // Safe increment
			title: data.title,
			completed: data.completed ?? false,
		};
		this.sampleData.push(newItem);
		return newItem;
	}

	async delete(id: string): Promise<boolean> {
		const index = this.sampleData.findIndex((t) => t.id === parseInt(id, 10));
		if (index === -1) return false;
		this.sampleData.splice(index, 1);
		return true;
	}
}
