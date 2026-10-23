import { Router } from 'express';
import {
  getStyles,
  getStyle,
  getAdminStyles,
  createStyle,
  updateStyle,
  deleteStyle
} from '../controllers/styleController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/styles', getStyles);
router.get('/styles/:key', getStyle);

// Admin routes
router.get('/admin/styles', auth('admin', 'editor'), getAdminStyles);
router.post('/admin/styles', auth('admin', 'editor'), createStyle);
router.put('/admin/styles/:id', auth('admin', 'editor'), updateStyle);
router.delete('/admin/styles/:id', auth('admin', 'editor'), deleteStyle);

export default router;
