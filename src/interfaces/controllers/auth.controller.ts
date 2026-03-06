import type { Request, Response } from "express";
import type { AuthService } from "../../application/services/auth.service.js";
import { BaseController } from "./base.controller.js";

export class AuthController extends BaseController {
	private authService: AuthService;

	constructor(authService: AuthService) {
		super();
		this.authService = authService;
	}

	login = async (req: Request, res: Response): Promise<Response> => {
		const { email, password } = req.body;

		const result = await this.authService.login(email, password);

		if (!result) {
			return this.handleError(res, "Invalid email or password", 401);
		}

		return this.handleSuccess(res, result, "Login successful");
	};
}
