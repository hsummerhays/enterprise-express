import { SampleData } from "../../domain/entities/SampleData.js";
import type { SampleDataRepository as ISampleDataRepository } from "../../domain/repositories/SampleDataRepository.js";
import db from "../database/sqlite.js";

function toSampleData(row: Record<string, unknown>): SampleData {
	return new SampleData(
		row.id as number,
		row.title as string,
		Boolean(row.completed),
	);
}

export class SqliteSampleDataRepository implements ISampleDataRepository {
	async findAll(): Promise<SampleData[]> {
		const stmt = db.prepare("SELECT * FROM sample_data");
		const rows = stmt.all() as Record<string, unknown>[];
		return rows.map(toSampleData);
	}

	async findById(id: number): Promise<SampleData | null> {
		const stmt = db.prepare("SELECT * FROM sample_data WHERE id = ?");
		const row = stmt.get(id) as Record<string, unknown> | undefined;
		return row ? toSampleData(row) : null;
	}

	async save(data: Omit<SampleData, "id">): Promise<SampleData> {
		const stmt = db.prepare(
			"INSERT INTO sample_data (title, completed) VALUES (?, ?) RETURNING *",
		);
		const row = stmt.get(data.title, data.completed ? 1 : 0) as Record<
			string,
			unknown
		>;
		return toSampleData(row);
	}

	async delete(id: number): Promise<boolean> {
		const stmt = db.prepare("DELETE FROM sample_data WHERE id = ?");
		const info = stmt.run(id);
		return info.changes > 0;
	}
}
