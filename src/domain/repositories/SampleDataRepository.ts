import type { SampleData } from "../entities/SampleData.js";

export interface SampleDataRepository {
	findAll(): Promise<SampleData[]>;
	findById(id: number): Promise<SampleData | null>;
	save(data: Omit<SampleData, "id">): Promise<SampleData>;
	delete(id: number): Promise<boolean>;
}
