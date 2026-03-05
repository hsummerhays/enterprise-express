/**
 * Typed JWT payload — replaces `any` in auth middleware and service.
 */
export interface JwtPayload {
	id: number;
	email: string;
	role: string;
}
