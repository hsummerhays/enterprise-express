import type { UnitOfWorkPort } from "../../application/ports/UnitOfWorkPort.js";

export class InMemoryUnitOfWorkAdapter implements UnitOfWorkPort {
	async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
		return work();
	}
}
