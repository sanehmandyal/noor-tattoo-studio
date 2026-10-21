import { Router } from 'express';
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/testimonials', getTestimonials);
router.get('/testimonials/:key', getTestimonial);

// Admin routes
router.post('/admin/testimonials', auth('admin', 'editor'), createTestimonial);
router.put('/admin/testimonials/:id', auth('admin', 'editor'), updateTestimonial);
router.delete('/admin/testimonials/:id', auth('admin', 'editor'), deleteTestimonial);

export default router;
