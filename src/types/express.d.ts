declare global {
	namespace Express {
		export interface Locals {
			requestId: string;
		}
	}
}
