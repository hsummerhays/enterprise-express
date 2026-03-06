import { NotFoundError } from "../../../domain/errors/DomainError.js";
import type { UserRepository } from "../../../domain/repositories/UserRepository.js";
import type { UserResponse } from "../../dto/UserDTOs.ts";
import { UserMapper } from "../../mappers/UserMapper.js";

export class GetUserByIdUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(id: number): Promise<UserResponse> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundError("User");
		}
		return UserMapper.toResponse(user);
	}
}
