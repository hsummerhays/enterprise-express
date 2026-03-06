import { NotFoundError } from "../../../domain/errors/DomainError.js";
import type { UserRepository } from "../../../domain/repositories/UserRepository.js";

export class DeleteUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(id: number): Promise<void> {
		const success = await this.userRepository.delete(id);
		if (!success) {
			throw new NotFoundError("User");
		}
	}
}
