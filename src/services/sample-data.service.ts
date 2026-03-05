import { SampleData, CreateSampleDataRequest } from '../schemas/sample-data.schema.js';

export class SampleDataService {
    private sampleData: SampleData[];

    constructor() {
        // Our in-memory "Database"
        this.sampleData = [
            { id: 1, title: 'Learn Express 5', completed: true },
            { id: 2, title: 'Configure Antigravity WSL', completed: false }
        ];
    }

    async getAll(): Promise<SampleData[]> {
        return this.sampleData;
    }

    async getById(id: string): Promise<SampleData | undefined> {
        return this.sampleData.find(t => t.id === parseInt(id));
    }

    async create(data: CreateSampleDataRequest): Promise<SampleData> {
        const newItem: SampleData = {
            id: this.sampleData.length + 1,
            title: data.title,
            completed: data.completed ?? false
        };
        this.sampleData.push(newItem);
        return newItem;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.sampleData.findIndex(t => t.id === parseInt(id));
        if (index === -1) return false;
        this.sampleData.splice(index, 1);
        return true;
    }
}
