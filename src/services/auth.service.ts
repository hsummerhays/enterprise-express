import * as argon2 from "argon2";
import { SignJWT } from "jose";
import type { JwtPayload } from "../types/auth.types.js";
import config from "../utils/config.js";

export class AuthService {
	private readonly jwtSecret: Uint8Array;

	constructor() {
		this.jwtSecret = new TextEncoder().encode(config.auth.jwtSecret);
	}

	async login(
		email: string,
		password: string,
	): Promise<{ user: JwtPayload; token: string } | null> {
		// Mock DB record with an argon2 hashed password
		// This is a hash for the password: 'P@ssword123'
		const mockDbUser = {
			id: 1,
			email: "admin@example.com",
			role: "admin",
			passwordHash:
				"$argon2id$v=19$m=65536,t=3,p=4$/0iA+F0yh+ie1t69J4hXlw$ukjP6aYW29K1c2TMXAp/qty7R680rfuC+WyOQMgLjdE",
		};

		if (email !== mockDbUser.email) {
			return null;
		}

		const isValid = await argon2.verify(mockDbUser.passwordHash, password);
		if (!isValid) {
			return null;
		}

		const user: JwtPayload = {
			id: mockDbUser.id,
			email: mockDbUser.email,
			role: mockDbUser.role,
		};

		const token = await new SignJWT({ ...user })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1h")
			.sign(this.jwtSecret);

		return { user, token };
	}
}
