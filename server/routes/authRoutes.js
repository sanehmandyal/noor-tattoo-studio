import { Router } from 'express';
import {
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import { loginLimit } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', loginLimit, login);
router.post('/logout', logout);
router.get('/me', auth(), getMe);
router.post('/forgot', loginLimit, forgotPassword);
router.post('/reset', loginLimit, resetPassword);

export default router;
