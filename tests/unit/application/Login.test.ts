import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PasswordHasher } from "../../../src/application/ports/PasswordHasherPort.js";
import type { TokenService } from "../../../src/application/ports/TokenServicePort.js";
import { LoginUseCase } from "../../../src/application/use-cases/auth/Login.js";
import { User } from "../../../src/domain/entities/User.js";
import { UnauthorizedError } from "../../../src/domain/errors/DomainError.js";
import type { UserRepository } from "../../../src/domain/repositories/UserRepository.js";

describe("LoginUseCase", () => {
	let loginUseCase: LoginUseCase;
	let userRepository: UserRepository;
	let passwordHasher: PasswordHasher;
	let tokenService: TokenService;

	beforeEach(() => {
		userRepository = {
			findByEmail: vi.fn(),
			save: vi.fn(),
			findById: vi.fn(),
			findAll: vi.fn(),
			delete: vi.fn(),
		} as unknown as UserRepository;

		passwordHasher = {
			hash: vi.fn(),
			verify: vi.fn(),
		} as unknown as PasswordHasher;

		tokenService = {
			sign: vi.fn(),
			verify: vi.fn(),
		} as unknown as TokenService;

		loginUseCase = new LoginUseCase(
			userRepository,
			passwordHasher,
			tokenService,
		);
	});

	it("should return login response for valid credentials", async () => {
		const mockUser = new User(
			1,
			"Test User",
			"test@example.com",
			"2024-01-01",
			"hashed_password",
		);
		vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);
		vi.mocked(passwordHasher.verify).mockResolvedValue(true);
		vi.mocked(tokenService.sign).mockResolvedValue("mock_token");

		const result = await loginUseCase.execute({
			email: "test@example.com",
			password: "password123",
		});

		expect(result.token).toBe("mock_token");
		expect(result.user.email).toBe("test@example.com");
	});

	it("should throw UnauthorizedError for non-existent user", async () => {
		vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

		await expect(
			loginUseCase.execute({
				email: "notfound@example.com",
				password: "password",
			}),
		).rejects.toThrow(UnauthorizedError);
	});

	it("should throw UnauthorizedError for invalid password", async () => {
		const mockUser = new User(
			1,
			"Test User",
			"test@example.com",
			"2024-01-01",
			"hashed_password",
		);
		vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);
		vi.mocked(passwordHasher.verify).mockResolvedValue(false);

		await expect(
			loginUseCase.execute({
				email: "test@example.com",
				password: "wrong_password",
			}),
		).rejects.toThrow(UnauthorizedError);
	});
});
