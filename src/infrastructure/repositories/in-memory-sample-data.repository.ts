import { SampleData } from "../../domain/entities/SampleData.js";
import type { SampleDataRepository } from "../../domain/repositories/SampleDataRepository.js";

/**
 * In-memory implementation of SampleDataRepository.
 * Used in tests and local development to avoid database dependencies.
 * Swap with SqliteSampleDataRepository (or any other implementation) in container.ts.
 */
export class InMemorySampleDataRepository implements SampleDataRepository {
	private items = new Map<number, SampleData>();
	private nextId = 1;

	async findAll(): Promise<SampleData[]> {
		return [...this.items.values()];
	}

	async findById(id: number): Promise<SampleData | null> {
		return this.items.get(id) ?? null;
	}

	async save(data: Omit<SampleData, "id">): Promise<SampleData> {
		const item = new SampleData(this.nextId++, data.title, data.completed);
		this.items.set(item.id, item);
		return item;
	}

	async delete(id: number): Promise<boolean> {
		return this.items.delete(id);
	}
}
