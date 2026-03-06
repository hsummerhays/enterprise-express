import { Router } from "express";
import type { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUserSchema } from "../validators/user.validators.js";
import { idParamSchema } from "../validators/common.validators.js";

export function registerUserRoutes(
	router: Router,
	controller: UserController,
): void {
	router.get("/", controller.getAllUsers);
	router.get("/:id", validate(idParamSchema), controller.getUserById);
	router.post("/", authenticate, validate(createUserSchema), controller.createUser);
	router.delete("/:id", authenticate, validate(idParamSchema), controller.deleteUser);
}
