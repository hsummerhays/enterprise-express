import { User } from "../../domain/entities/User.js";
import { UserAlreadyExistsError } from "../../domain/errors/DomainError.js";
import type {
	SaveUserData,
	UserRepository,
} from "../../domain/repositories/UserRepository.js";

/**
 * In-memory implementation of UserRepository.
 * Used in tests and local development to avoid database dependencies.
 * Swap with SqliteUserRepository (or any other implementation) in container.ts.
 */
export class InMemoryUserRepository implements UserRepository {
	private users = new Map<number, User>();
	private nextId = 1;

	async save(data: SaveUserData): Promise<User> {
		const emailExists = [...this.users.values()].some(
			(u) => u.email === data.email,
		);
		if (emailExists) {
			throw new UserAlreadyExistsError(data.email);
		}

		const user = new User(
			this.nextId++,
			data.name,
			data.email,
			new Date().toISOString(),
			data.passwordHash,
			data.role,
		);
		this.users.set(user.id, user);
		return user;
	}

	async findById(id: number): Promise<User | null> {
		return this.users.get(id) ?? null;
	}

	async findByEmail(email: string): Promise<User | null> {
		return [...this.users.values()].find((u) => u.email === email) ?? null;
	}

	async findAll(): Promise<User[]> {
		return [...this.users.values()];
	}

	async delete(id: number): Promise<boolean> {
		return this.users.delete(id);
	}
}
