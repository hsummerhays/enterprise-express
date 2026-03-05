import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema } from '../schemas/auth.schema.js';

const router = Router();

// Orchestrate Dependencies
const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/login', validate(loginSchema), authController.login);

export default router;
