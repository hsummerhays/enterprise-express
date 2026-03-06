import type { Request, Response } from "express";
import type { LoginUseCase } from "../../../application/use-cases/auth/Login.js";
import { BaseController } from "./base.controller.js";

export class AuthController extends BaseController {
	constructor(private readonly loginUseCase: LoginUseCase) {
		super();
	}

	login = async (req: Request, res: Response): Promise<Response> => {
		const result = await this.loginUseCase.execute(req.body);
		return this.handleSuccess(res, result, "Login successful");
	};
}
