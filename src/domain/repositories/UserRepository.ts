import type { User } from "../entities/User.js";

export interface UserRepository {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    save(user: Omit<User, "id" | "createdAt">): Promise<User>;
    delete(id: number): Promise<boolean>;
}
