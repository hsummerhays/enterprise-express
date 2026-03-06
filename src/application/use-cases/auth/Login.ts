import { UnauthorizedError } from "../../../domain/errors/DomainError.js";
import type { UserRepository } from "../../../domain/repositories/UserRepository.js";
import type { LoginRequest, LoginResponse } from "../../dto/AuthDTOs.js";
import type { PasswordHasher } from "../../ports/PasswordHasherPort.js";
import type { TokenService } from "../../ports/TokenServicePort.js";

export class LoginUseCase {
	constructor(
		private userRepository: UserRepository,
		private passwordHasher: PasswordHasher,
		private tokenService: TokenService,
	) {}

	async execute(request: LoginRequest): Promise<LoginResponse> {
		const user = await this.userRepository.findByEmail(request.email);

		const passwordHash = user?.getPasswordHash();
		if (!user || !passwordHash) {
			throw new UnauthorizedError("Invalid email or password");
		}

		const isPasswordValid = await this.passwordHasher.verify(
			request.password,
			passwordHash,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedError("Invalid email or password");
		}

		const token = await this.tokenService.sign({
			id: user.id,
			email: user.email,
			role: user.role,
		});

		return {
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
			token,
		};
	}
}
