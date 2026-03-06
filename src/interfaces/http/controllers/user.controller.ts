import type { Request, Response } from "express";
import type { CreateUserUseCase } from "../../../application/use-cases/users/CreateUser.js";
import type { GetAllUsersUseCase } from "../../../application/use-cases/users/GetAllUsers.js";
import type { GetUserByIdUseCase } from "../../../application/use-cases/users/GetUserById.js";
import type { DeleteUserUseCase } from "../../../application/use-cases/users/DeleteUser.js";
import { BaseController } from "./base.controller.js";

export class UserController extends BaseController {
	constructor(
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly getAllUsersUseCase: GetAllUsersUseCase,
		private readonly getUserByIdUseCase: GetUserByIdUseCase,
		private readonly deleteUserUseCase: DeleteUserUseCase,
	) {
		super();
	}

	getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
		const users = await this.getAllUsersUseCase.execute();
		return this.handleSuccess(res, users);
	};

	getUserById = async (req: Request, res: Response): Promise<Response> => {
		const id = Number(req.params.id);
		const user = await this.getUserByIdUseCase.execute(id);
		return this.handleSuccess(res, user);
	};

	createUser = async (req: Request, res: Response): Promise<Response> => {
		const newUser = await this.createUserUseCase.execute(req.body);
		return this.handleSuccess(res, newUser, "User created successfully", 201);
	};

	deleteUser = async (
		req: Request,
		res: Response,
	): Promise<Response | undefined> => {
		const id = Number(req.params.id);
		await this.deleteUserUseCase.execute(id);
		return this.handleNoContent(res);
	};
}
