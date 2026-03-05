import { Router } from 'express';
import { sampleDataController } from '../controllers/sample-data.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createSampleDataSchema } from '../schemas/sample-data.schema.js';

const router = Router();

router.get('/', sampleDataController.getAll);

// Validation acts as the gatekeeper here
router.post('/', validate(createSampleDataSchema), sampleDataController.create);

router.delete('/:id', sampleDataController.remove);

export default router;