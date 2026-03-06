export class User {
	constructor(
		public readonly id: number,
		public readonly name: string,
		public readonly email: string,
		public readonly createdAt: string,
		private readonly passwordHash?: string,
		public readonly role: string = "user",
	) {}

	getPasswordHash(): string | undefined {
		return this.passwordHash;
	}
}
