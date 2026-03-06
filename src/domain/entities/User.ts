export class User {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly email: string,
        public readonly createdAt: string,
        public readonly passwordHash?: string,
        public readonly role: string = "user",
    ) { }
}
