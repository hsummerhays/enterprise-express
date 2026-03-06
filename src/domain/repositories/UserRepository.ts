import type { User } from "../entities/User.js";

export interface SaveUserData {
	name: string;
	email: string;
	passwordHash: string;
	role: string;
}

export interface UserRepository {
	findById(id: number): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findAll(): Promise<User[]>;
	save(data: SaveUserData): Promise<User>;
	delete(id: number): Promise<boolean>;
}
