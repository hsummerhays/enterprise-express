import { AppError } from "../../utils/errors.js";

export class DomainError extends AppError {
    constructor(message: string, statusCode = 400) {
        super(message, statusCode);
    }
}

export class ValidationError extends DomainError {
    public readonly details: unknown;

    constructor(message = "Validation failed", details: unknown = null) {
        super(message, 400);
        this.details = details;
    }
}

export class UserAlreadyExistsError extends DomainError {
    constructor(email: string) {
        super(`User already exists with email: ${email}`, 400);
    }
}

export class NotFoundError extends DomainError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, 404);
    }
}
