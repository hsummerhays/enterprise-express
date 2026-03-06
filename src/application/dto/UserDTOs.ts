export interface CreateUserRequest {
	name: string;
	email: string;
	password: string;
}

export interface UserResponse {
	id: number;
	name: string;
	email: string;
	role: string;
	createdAt: string;
}
