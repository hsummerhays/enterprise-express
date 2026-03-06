import { describe, expect, it, vi, beforeEach } from "vitest";
import { LoginUseCase } from "./Login.js";
import type { UserRepository } from "../../../domain/repositories/UserRepository.js";
import type { PasswordHasher } from "../../ports/PasswordHasher.js";
import type { TokenService } from "../../ports/TokenService.js";
import { User } from "../../../domain/entities/User.js";
import { UnauthorizedError } from "../../../utils/errors.js";

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

        loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);
    });

    it("should return login response for valid credentials", async () => {
        const mockUser = new User(1, "Test User", "test@example.com", "2024-01-01", "hashed_password");
        vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);
        vi.mocked(passwordHasher.verify).mockResolvedValue(true);
        vi.mocked(tokenService.sign).mockResolvedValue("mock_token");

        const result = await loginUseCase.execute({ email: "test@example.com", password: "password123" });

        expect(result.token).toBe("mock_token");
        expect(result.user.email).toBe("test@example.com");
    });

    it("should throw UnauthorizedError for non-existent user", async () => {
        vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

        await expect(loginUseCase.execute({ email: "notfound@example.com", password: "password" }))
            .rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError for invalid password", async () => {
        const mockUser = new User(1, "Test User", "test@example.com", "2024-01-01", "hashed_password");
        vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);
        vi.mocked(passwordHasher.verify).mockResolvedValue(false);

        await expect(loginUseCase.execute({ email: "test@example.com", password: "wrong_password" }))
            .rejects.toThrow(UnauthorizedError);
    });
});
