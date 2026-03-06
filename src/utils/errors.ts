import { DomainError } from "../domain/errors/DomainError.js";

export { DomainError };

/**
 * AppError extends DomainError with an isOperational flag.
 * isOperational = true  → expected error (e.g. validation, not found)
 * isOperational = false → programmer error or unexpected failure
 */
export class AppError extends DomainError {
	public readonly isOperational: boolean;

	constructor(message: string, statusCode: number, isOperational = true) {
		super(message, statusCode);
		this.isOperational = isOperational;
	}
}
