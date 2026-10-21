import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import artistRoutes from './artistRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import blogRoutes from './blogRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import faqRoutes from './faqRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import statsRoutes from './statsRoutes.js';

const router = Router();

// Mount auth & user management routes
router.use('/auth', authRoutes);
router.use('/admin', userRoutes);

// Mount public and admin resources
router.use(artistRoutes);
router.use(galleryRoutes);
router.use(serviceRoutes);
router.use(blogRoutes);
router.use(testimonialRoutes);
router.use(faqRoutes);
router.use(bookingRoutes);
router.use(inquiryRoutes);
router.use(settingsRoutes);
router.use(uploadRoutes);
router.use(statsRoutes);

export default router;
