import type { UserRepository } from "../../../domain/repositories/UserRepository.js";
import type { PasswordHasher } from "../../ports/PasswordHasher.js";
import type { TokenService } from "../../ports/TokenService.js";
import type { LoginRequest, LoginResponse } from "../../dto/AuthDTOs.js";
import { UnauthorizedError } from "../../../utils/errors.js";

export class LoginUseCase {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher,
        private tokenService: TokenService,
    ) { }

    async execute(request: LoginRequest): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(request.email);

        if (!user || !user.passwordHash) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const isPasswordValid = await this.passwordHasher.verify(
            request.password,
            user.passwordHash,
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
