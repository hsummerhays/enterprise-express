import type { UserRepository } from "../../../domain/repositories/UserRepository.js";
import type { UserResponse } from "../../dto/UserDTOs.ts";
import { UserMapper } from "../../mappers/UserMapper.js";

export class GetAllUsersUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(): Promise<UserResponse[]> {
        const users = await this.userRepository.findAll();
        return users.map(UserMapper.toResponse);
    }
}
