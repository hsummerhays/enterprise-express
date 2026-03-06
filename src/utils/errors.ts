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

