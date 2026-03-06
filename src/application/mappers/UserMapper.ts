import type { User } from "../../domain/entities/User.js";
import type { UserResponse } from "../dto/UserDTOs.js";

export class UserMapper {
    static toResponse(user: User): UserResponse {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
}
