import { DatabaseSync } from "node:sqlite";
import logger from "../../utils/logger.js";

/**
 * Shared SQLite database instance.
 * Uses in-memory storage by default. Replace ":memory:" with a file path
 * (e.g., "./data/app.db") for persistent storage.
 */
const db = new DatabaseSync(":memory:");

/**
 * Initialize all database tables and seed data.
 * Called once at module load time.
 */
function initializeDatabase(): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			passwordHash TEXT NOT NULL,
			createdAt TEXT NOT NULL
		)
	`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS sample_data (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			completed INTEGER NOT NULL DEFAULT 0
		)
	`);

	// Seed sample data
	const insertStmt = db.prepare(
		"INSERT OR IGNORE INTO sample_data (id, title, completed) VALUES (?, ?, ?)",
	);
	insertStmt.run(1, "Learn Express 5", 1);
	insertStmt.run(2, "Configure Antigravity WSL", 0);

	// Seed admin user
	const userStmt = db.prepare(
		"INSERT OR IGNORE INTO users (id, name, email, passwordHash, createdAt) VALUES (?, ?, ?, ?, ?)",
	);
	userStmt.run(
		1,
		"Admin User",
		"admin@example.com",
		"$argon2id$v=19$m=65536,t=3,p=4$/0iA+F0yh+ie1t69J4hXlw$ukjP6aYW29K1c2TMXAp/qty7R680rfuC+WyOQMgLjdE",
		new Date().toISOString(),
	);

	logger.info("SQLite database initialized");
}

initializeDatabase();

/**
 * Close the database connection gracefully.
 */
export const disconnectDatabase = (): void => {
	db.close();
	logger.info("SQLite database connection closed");
};

export default db;
