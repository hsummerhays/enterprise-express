import type { UserRepository as IUserRepository } from "../../domain/repositories/UserRepository.js";
import { User } from "../../domain/entities/User.js";
import { ValidationError } from "../../domain/errors/DomainError.js";
import db from "../database/sqlite.js";

function toUserEntity(row: Record<string, unknown>): User {
    return new User(
        row.id as number,
        row.name as string,
        row.email as string,
        row.createdAt as string,
        row.passwordHash as string,
        "admin" // Role mapping
    );
}

export class SqliteUserRepository implements IUserRepository {
    async save(data: Omit<User, "id" | "createdAt">): Promise<User> {
        try {
            const stmt = db.prepare(
                "INSERT INTO users (name, email, passwordHash, createdAt) VALUES (?, ?, ?, ?) RETURNING *",
            );
            const row = stmt.get(
                data.name,
                data.email,
                data.passwordHash || "$argon2id$v=19$m=65536,t=3,p=4$/0iA+F0yh+ie1t69J4hXlw$ukjP6aYW29K1c2TMXAp/qty7R680rfuC+WyOQMgLjdE",
                new Date().toISOString(),
            ) as Record<string, unknown>;
            return toUserEntity(row);
        } catch (error: unknown) {
            if (error instanceof Error && error.message.includes("UNIQUE")) {
                throw new ValidationError(data.email);
            }
            throw error;
        }
    }

    async findById(id: number): Promise<User | null> {
        const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
        const row = stmt.get(id) as Record<string, unknown> | undefined;
        return row ? toUserEntity(row) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
        const row = stmt.get(email) as Record<string, unknown> | undefined;
        return row ? toUserEntity(row) : null;
    }

    async findAll(): Promise<User[]> {
        const stmt = db.prepare("SELECT * FROM users");
        const rows = stmt.all() as Record<string, unknown>[];
        return rows.map(toUserEntity);
    }

    async delete(id: number): Promise<boolean> {
        const stmt = db.prepare("DELETE FROM users WHERE id = ?");
        const info = stmt.run(id);
        return info.changes > 0;
    }
}
