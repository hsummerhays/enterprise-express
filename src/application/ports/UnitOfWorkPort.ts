export interface UnitOfWorkPort {
	runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
