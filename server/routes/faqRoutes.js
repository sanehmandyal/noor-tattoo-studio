import { Router } from 'express';
import {
  getFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../controllers/faqController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/faqs', getFAQs);
router.get('/faqs/:key', getFAQ);

// Admin routes
router.post('/admin/faqs', auth('admin', 'editor'), createFAQ);
router.put('/admin/faqs/:id', auth('admin', 'editor'), updateFAQ);
router.delete('/admin/faqs/:id', auth('admin', 'editor'), deleteFAQ);

export default router;
