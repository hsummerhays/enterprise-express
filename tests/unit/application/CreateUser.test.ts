import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PasswordHasher } from "../../../src/application/ports/PasswordHasherPort.js";
import { CreateUserUseCase } from "../../../src/application/use-cases/users/CreateUser.js";
import { User } from "../../../src/domain/entities/User.js";
import { UserAlreadyExistsError } from "../../../src/domain/errors/DomainError.js";
import type { UserRepository } from "../../../src/domain/repositories/UserRepository.js";

describe("CreateUserUseCase", () => {
	let createUserUseCase: CreateUserUseCase;
	let userRepository: UserRepository;
	let passwordHasher: PasswordHasher;

	beforeEach(() => {
		userRepository = {
			findByEmail: vi.fn(),
			save: vi.fn(),
		} as unknown as UserRepository;
		passwordHasher = {
			hash: vi.fn().mockResolvedValue("hashed_password"),
			verify: vi.fn(),
		} as unknown as PasswordHasher;
		createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
	});

	it("should create user and return mapped response", async () => {
		vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
		const savedUser = new User(1, "New User", "new@example.com", "2024-01-01");
		vi.mocked(userRepository.save).mockResolvedValue(savedUser);

		const result = await createUserUseCase.execute({
			name: "New User",
			email: "new@example.com",
			password: "password123",
		});

		expect(result.id).toBe(1);
		expect(result.email).toBe("new@example.com");
		expect(passwordHasher.hash).toHaveBeenCalledWith("password123");
	});

	it("should throw error if email already exists", async () => {
		vi.mocked(userRepository.findByEmail).mockResolvedValue(
			new User(1, "Old", "old@example.com", ""),
		);

		await expect(
			createUserUseCase.execute({
				name: "Old",
				email: "old@example.com",
				password: "password123",
			}),
		).rejects.toThrow(UserAlreadyExistsError);
	});
});
