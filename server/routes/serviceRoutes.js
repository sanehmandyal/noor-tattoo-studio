import { Router } from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/services', getServices);
router.get('/services/:key', getService);

// Admin routes
router.post('/admin/services', auth('admin', 'editor'), createService);
router.put('/admin/services/:id', auth('admin', 'editor'), updateService);
router.delete('/admin/services/:id', auth('admin', 'editor'), deleteService);

export default router;
