export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	user: {
		id: number;
		email: string;
		role: string;
	};
	token: string;
}
