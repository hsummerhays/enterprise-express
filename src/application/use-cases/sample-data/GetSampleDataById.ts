import { NotFoundError } from "../../../domain/errors/DomainError.js";
import type { SampleDataRepository } from "../../../domain/repositories/SampleDataRepository.js";

export class GetSampleDataByIdUseCase {
	constructor(private repository: SampleDataRepository) {}

	async execute(id: number) {
		const item = await this.repository.findById(id);
		if (!item) {
			throw new NotFoundError("Sample Data");
		}
		return item;
	}
}
