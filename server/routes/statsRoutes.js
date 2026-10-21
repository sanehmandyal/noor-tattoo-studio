import { Router } from 'express';
import { getStats, getChartData } from '../controllers/statsController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/admin/stats', auth(), getStats);
router.get('/admin/chart', auth(), getChartData);

export default router;
