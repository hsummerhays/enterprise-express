/**
 * Structured error classes for consistent API error handling.
 */

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational: boolean;

	constructor(message: string, statusCode: number, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class NotFoundError extends AppError {
	constructor(resource = "Resource") {
		super(`${resource} not found`, 404);
	}
}

export class ValidationError extends AppError {
	public readonly details: unknown;

	constructor(message = "Validation failed", details: unknown = null) {
		super(message, 400);
		this.details = details;
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Authentication required") {
		super(message, 401);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = "Access denied") {
		super(message, 403);
	}
}
