import type { UserRepository } from "../../../domain/repositories/UserRepository.js";
import type { CreateUserRequest, UserResponse } from "../../dto/UserDTOs.ts";
import { UserMapper } from "../../mappers/UserMapper.js";
import { UserAlreadyExistsError } from "../../../domain/errors/DomainError.js";

export class CreateUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(request: CreateUserRequest): Promise<UserResponse> {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new UserAlreadyExistsError(request.email);
        }

        const user = await this.userRepository.save({
            name: request.name,
            email: request.email,
            role: "user",
            passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$/0iA+F0yh+ie1t69J4hXlw$ukjP6aYW29K1c2TMXAp/qty7R680rfuC+WyOQMgLjdE", // Default for demo
        });

        return UserMapper.toResponse(user);
    }
}
