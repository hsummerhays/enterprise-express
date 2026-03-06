export class DomainError extends Error {
	public readonly statusCode: number;

	constructor(message: string, statusCode = 400) {
		super(message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, new.target.prototype);
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
