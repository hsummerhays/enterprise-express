import * as argon2 from "argon2";
import { SignJWT } from "jose";
import type { AuthRepository } from "../../infrastructure/repositories/auth.repository.js";
import type { JwtPayload } from "../../types/auth.types.js";
import config from "../../utils/config.js";

export class AuthService {
	private readonly jwtSecret: Uint8Array;
	private readonly authRepository: AuthRepository;

	constructor(authRepository: AuthRepository) {
		this.jwtSecret = new TextEncoder().encode(config.auth.jwtSecret);
		this.authRepository = authRepository;
	}

	async login(
		email: string,
		password: string,
	): Promise<{ user: JwtPayload; token: string } | null> {
		const dbUser = await this.authRepository.findUserByEmail(email);

		if (!dbUser) {
			return null;
		}

		const isValid = await argon2.verify(dbUser.passwordHash, password);
		if (!isValid) {
			return null;
		}

		const user: JwtPayload = {
			id: dbUser.id,
			email: dbUser.email,
			role: dbUser.role,
		};

		const token = await new SignJWT({ ...user })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1h")
			.sign(this.jwtSecret);

		return { user, token };
	}
}
