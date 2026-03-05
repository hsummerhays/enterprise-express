import { Router, Request, Response } from 'express';
import { HealthService } from '../services/health.service.js';

const router = Router();
const healthService = new HealthService();

router.get('/', async (req: Request, res: Response) => {
    const data = await healthService.getSystemStatus();
    res.status(200).json(data);
});

export default router;
