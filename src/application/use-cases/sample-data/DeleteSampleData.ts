import type { SampleDataRepository } from "../../../domain/repositories/SampleDataRepository.js";
import { NotFoundError } from "../../../domain/errors/DomainError.js";

export class DeleteSampleDataUseCase {
    constructor(private repository: SampleDataRepository) { }

    async execute(id: number): Promise<void> {
        const success = await this.repository.delete(id);
        if (!success) {
            throw new NotFoundError("Sample Data");
        }
    }
}
