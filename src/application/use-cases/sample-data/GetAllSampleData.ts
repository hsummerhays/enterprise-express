import type { SampleDataRepository } from "../../../domain/repositories/SampleDataRepository.js";

export class GetAllSampleDataUseCase {
    constructor(private repository: SampleDataRepository) { }

    async execute() {
        return this.repository.findAll();
    }
}
