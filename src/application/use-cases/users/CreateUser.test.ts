import { describe, expect, it, vi, beforeEach } from "vitest";
import { CreateUserUseCase } from "./CreateUser.js";
import type { UserRepository } from "../../../domain/repositories/UserRepository.js";
import { User } from "../../../domain/entities/User.js";
import { UserAlreadyExistsError } from "../../../domain/errors/DomainError.js";

describe("CreateUserUseCase", () => {
    let createUserUseCase: CreateUserUseCase;
    let userRepository: UserRepository;

    beforeEach(() => {
        userRepository = {
            findByEmail: vi.fn(),
            save: vi.fn(),
        } as unknown as UserRepository;
        createUserUseCase = new CreateUserUseCase(userRepository);
    });

    it("should create user and return mapped response", async () => {
        vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
        const savedUser = new User(1, "New User", "new@example.com", "2024-01-01");
        vi.mocked(userRepository.save).mockResolvedValue(savedUser);

        const result = await createUserUseCase.execute({ name: "New User", email: "new@example.com" });

        expect(result.id).toBe(1);
        expect(result.email).toBe("new@example.com");
    });

    it("should throw error if email already exists", async () => {
        vi.mocked(userRepository.findByEmail).mockResolvedValue(new User(1, "Old", "old@example.com", ""));

        await expect(createUserUseCase.execute({ name: "Old", email: "old@example.com" }))
            .rejects.toThrow(UserAlreadyExistsError);
    });
});
