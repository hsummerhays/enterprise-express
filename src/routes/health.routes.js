import { Router } from 'express';
import { healthService } from '#services/health.service';

const router = Router();

// Define the route logic
router.get('/', async (req, res) => {
    const data = await healthService.getSystemStatus();
    res.status(200).json(data);
});

export default router;