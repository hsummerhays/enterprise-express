import { UserAlreadyExistsError } from "../../../domain/errors/DomainError.js";
import type { UserRepository } from "../../../domain/repositories/UserRepository.js";
import type { CreateUserRequest, UserResponse } from "../../dto/UserDTOs.js";
import { UserMapper } from "../../mappers/UserMapper.js";
import type { PasswordHasher } from "../../ports/PasswordHasherPort.js";

export class CreateUserUseCase {
	constructor(
		private userRepository: UserRepository,
		private passwordHasher: PasswordHasher,
	) {}

	async execute(request: CreateUserRequest): Promise<UserResponse> {
		const existingUser = await this.userRepository.findByEmail(request.email);
		if (existingUser) {
			throw new UserAlreadyExistsError(request.email);
		}

		const passwordHash = await this.passwordHasher.hash(request.password);

		const user = await this.userRepository.save({
			name: request.name,
			email: request.email,
			role: "user",
			passwordHash,
		});

		return UserMapper.toResponse(user);
	}
}
