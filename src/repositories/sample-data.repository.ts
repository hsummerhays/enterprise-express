import type {
	CreateSampleDataRequest,
	SampleData,
} from "../schemas/sample-data.schema.js";

export class SampleDataRepository {
	private sampleData: SampleData[];
	private nextId: number = 3;

	constructor() {
		this.sampleData = [
			{ id: 1, title: "Learn Express 5", completed: true },
			{ id: 2, title: "Configure Antigravity WSL", completed: false },
		];
	}

	async findAll(): Promise<SampleData[]> {
		return [...this.sampleData];
	}

	async findById(id: number): Promise<SampleData | undefined> {
		return this.sampleData.find((t) => t.id === id);
	}

	async create(data: CreateSampleDataRequest): Promise<SampleData> {
		const newItem: SampleData = {
			id: this.nextId++,
			title: data.title,
			completed: data.completed ?? false,
		};
		this.sampleData.push(newItem);
		return newItem;
	}

	async delete(id: number): Promise<boolean> {
		const index = this.sampleData.findIndex((t) => t.id === id);
		if (index === -1) return false;
		this.sampleData.splice(index, 1);
		return true;
	}
}
