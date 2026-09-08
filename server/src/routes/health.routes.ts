import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'HEALTHY',
    service: 'AegisAlert Emergency API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;
