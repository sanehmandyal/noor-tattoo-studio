import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { auth } from '../middleware/auth.js';
import { formLimit } from '../middleware/rateLimiter.js';

const router = Router();

// Public contact submission
router.post('/contact', formLimit, createInquiry);

// Admin inquiry management
router.get('/admin/inquiries', auth('admin'), getInquiries);
router.patch('/admin/inquiries/:id', auth('admin'), updateInquiry);
router.delete('/admin/inquiries/:id', auth('admin'), deleteInquiry);

export default router;
