export interface MockDbUser {
	id: number;
	email: string;
	role: string;
	passwordHash: string;
}

export class AuthRepository {
	private readonly mockDbUser: MockDbUser = {
		id: 1,
		email: "admin@example.com",
		role: "admin",
		passwordHash:
			"$argon2id$v=19$m=65536,t=3,p=4$/0iA+F0yh+ie1t69J4hXlw$ukjP6aYW29K1c2TMXAp/qty7R680rfuC+WyOQMgLjdE",
	};

	async findUserByEmail(email: string): Promise<MockDbUser | null> {
		if (email === this.mockDbUser.email) {
			return this.mockDbUser;
		}
		return null;
	}
}
