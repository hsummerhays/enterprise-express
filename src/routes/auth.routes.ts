import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { AuthService } from "../services/auth.service.js";

const router = Router();

// Orchestrate Dependencies
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/login", validate(loginSchema), authController.login);

export default router;
