import type { UnitOfWorkPort } from "../../application/ports/UnitOfWorkPort.js";
import db from "../database/sqlite.js";

export class SqliteUnitOfWorkAdapter implements UnitOfWorkPort {
	async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
		db.exec("BEGIN");
		try {
			const result = await work();
			db.exec("COMMIT");
			return result;
		} catch (error) {
			db.exec("ROLLBACK");
			throw error;
		}
	}
}
