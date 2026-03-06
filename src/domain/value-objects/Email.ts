export class Email {
    constructor(private readonly value: string) {
        if (!value.includes("@")) {
            throw new Error("Invalid email format");
        }
    }

    getValue(): string {
        return this.value;
    }
}
