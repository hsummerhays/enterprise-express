import * as argon2 from "argon2";
import type { PasswordHasher } from "../../application/ports/PasswordHasherPort.js";

export class Argon2PasswordHasherAdapter implements PasswordHasher {
	async hash(password: string): Promise<string> {
		return argon2.hash(password);
	}

	async verify(password: string, hash: string): Promise<boolean> {
		return argon2.verify(hash, password);
	}
}
