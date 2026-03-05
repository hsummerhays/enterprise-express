import { Router } from "express";
import { SampleDataController } from "../controllers/sample-data.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createSampleDataSchema } from "../schemas/sample-data.schema.js";
import { SampleDataService } from "../services/sample-data.service.js";

const router = Router();

// Manual Dependency Injection at the route level
const sampleDataService = new SampleDataService();
const sampleDataController = new SampleDataController(sampleDataService);

router.get("/", sampleDataController.getAll);

router.post(
	"/",
	authenticate,
	validate(createSampleDataSchema),
	sampleDataController.create,
);

router.delete("/:id", authenticate, sampleDataController.remove);

export default router;
