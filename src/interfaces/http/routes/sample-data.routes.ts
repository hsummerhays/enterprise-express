import type { Router } from "express";
import type { SampleDataController } from "../controllers/sample-data.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema } from "../validators/common.validators.js";
import { createSampleDataSchema } from "../validators/sample-data.validators.js";

export function registerSampleDataRoutes(
	router: Router,
	controller: SampleDataController,
): void {
	router.get("/", controller.getAll);
	router.post(
		"/",
		authenticate,
		validate(createSampleDataSchema),
		controller.create,
	);
	router.delete(
		"/:id",
		authenticate,
		validate(idParamSchema),
		controller.remove,
	);
}
