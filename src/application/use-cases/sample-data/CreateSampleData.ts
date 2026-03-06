import type { SampleDataRepository } from "../../../domain/repositories/SampleDataRepository.js";
import type { CreateSampleDataRequest } from "../../dto/SampleDataDTOs.js";

export class CreateSampleDataUseCase {
    constructor(private repository: SampleDataRepository) { }

    async execute(request: CreateSampleDataRequest) {
        return this.repository.save({
            title: request.title,
            completed: request.completed ?? false,
        });
    }
}
