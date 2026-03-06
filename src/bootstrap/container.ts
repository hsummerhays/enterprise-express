import { SqliteUserRepository } from "../infrastructure/repositories/user.repository.js";
import { SqliteSampleDataRepository } from "../infrastructure/repositories/sample-data.repository.js";
import { Argon2PasswordHasher } from "../infrastructure/security/Argon2PasswordHasher.js";
import { JoseTokenService } from "../infrastructure/security/JoseTokenService.js";

import { LoginUseCase } from "../application/use-cases/auth/Login.js";
import { CreateUserUseCase } from "../application/use-cases/users/CreateUser.js";
import { GetAllUsersUseCase } from "../application/use-cases/users/GetAllUsers.js";
import { GetUserByIdUseCase } from "../application/use-cases/users/GetUserById.js";
import { DeleteUserUseCase } from "../application/use-cases/users/DeleteUser.js";
import { GetAllSampleDataUseCase } from "../application/use-cases/sample-data/GetAllSampleData.js";
import { GetSampleDataByIdUseCase } from "../application/use-cases/sample-data/GetSampleDataById.js";
import { CreateSampleDataUseCase } from "../application/use-cases/sample-data/CreateSampleData.js";
import { DeleteSampleDataUseCase } from "../application/use-cases/sample-data/DeleteSampleData.js";
import { GetHealthStatusUseCase } from "../application/use-cases/system/GetHealthStatus.js";

import { AuthController } from "../interfaces/http/controllers/auth.controller.js";
import { HealthController } from "../interfaces/http/controllers/health.controller.js";
import { UserController } from "../interfaces/http/controllers/user.controller.js";
import { SampleDataController } from "../interfaces/http/controllers/sample-data.controller.js";

/**
 * A lightweight Dependency Injection Container.
 * Acts as the centralized Composition Root for the entire application.
 */
class DIContainer {
	private dependencies = new Map<any, any>();

	register<T>(token: any, instance: T): void {
		this.dependencies.set(token, instance);
	}

	resolve<T>(token: any): T {
		const instance = this.dependencies.get(token);
		if (!instance) {
			const name = typeof token === "function" ? token.name : String(token);
			throw new Error(`Dependency '${name}' not found in container`);
		}
		return instance as T;
	}
}

export const container = new DIContainer();

// --- Infrastructure ---
const userRepository = new SqliteUserRepository();
const sampleDataRepository = new SqliteSampleDataRepository();
const passwordHasher = new Argon2PasswordHasher();
const tokenService = new JoseTokenService();

// --- Use Cases ---
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);
const getHealthStatusUseCase = new GetHealthStatusUseCase();

const createUserUseCase = new CreateUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const getAllSampleDataUseCase = new GetAllSampleDataUseCase(sampleDataRepository);
const getSampleDataByIdUseCase = new GetSampleDataByIdUseCase(sampleDataRepository);
const createSampleDataUseCase = new CreateSampleDataUseCase(sampleDataRepository);
const deleteSampleDataUseCase = new DeleteSampleDataUseCase(sampleDataRepository);

// --- Controllers ---
const authController = new AuthController(loginUseCase);
const healthController = new HealthController(getHealthStatusUseCase);
const userController = new UserController(
	createUserUseCase,
	getAllUsersUseCase,
	getUserByIdUseCase,
	deleteUserUseCase,
);
const sampleDataController = new SampleDataController(
	getAllSampleDataUseCase,
	getSampleDataByIdUseCase,
	createSampleDataUseCase,
	deleteSampleDataUseCase,
);

// --- Register ---
container.register(AuthController, authController);
container.register(HealthController, healthController);
container.register(UserController, userController);
container.register(SampleDataController, sampleDataController);
