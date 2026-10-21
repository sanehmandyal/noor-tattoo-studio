import { Router } from 'express';
import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController.js';
import { auth } from '../middleware/auth.js';
import { formLimit } from '../middleware/rateLimiter.js';

const router = Router();

// Public booking submission
router.post('/bookings', formLimit, createBooking);

// Admin booking management
router.get('/admin/bookings', auth('admin'), getBookings);
router.patch('/admin/bookings/:id', auth('admin'), updateBooking);
router.delete('/admin/bookings/:id', auth('admin'), deleteBooking);

export default router;
