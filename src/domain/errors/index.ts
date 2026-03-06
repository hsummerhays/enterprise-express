import { AppError } from "../../utils/errors.js";

export class DomainError extends AppError {
    constructor(message: string, statusCode: number) {
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

export class NotFoundError extends DomainError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, 404);
    }
}
export class UnauthorizedError extends DomainError {
    constructor(message = "Authentication required") {
        super(message, 401);
    }
}

export class ForbiddenError extends DomainError {
    constructor(message = "Access denied") {
        super(message, 403);
    }
}
