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

import bcrypt from 'bcryptjs';
import * as M from '../models/index.js';
import { autoSeedIfEmpty, ensureSuperAdmin } from '../config/bootstrap.js';

const router = Router();

// System Health & Diagnostics
router.get('/health', async (req, res) => {
  try {
    const users = await M.User.countDocuments();
    const settings = await M.Settings.countDocuments();
    const artists = await M.Artist.countDocuments();
    const gallery = await M.Gallery.countDocuments();
    const services = await M.Service.countDocuments();
    res.json({
      status: 'ok',
      version: '2.1.0',
      database: { users, settings, artists, gallery, services },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Idempotent Super Admin Setup & Full Database Seeder Endpoint
router.all('/setup-admin', async (req, res) => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@noortattoo.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@NoorTattoo2026!';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await M.User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          name: 'Noor (Founder)',
          email: adminEmail,
          password: hashedPassword,
          role: 'super_admin',
          status: 'active'
        }
      },
      { upsert: true, new: true }
    );

    // Also run full database seed if collections are empty
    await autoSeedIfEmpty();

    res.json({
      ok: true,
      message: 'Admin account and database initialized successfully!',
      admin: { email: admin.email, role: admin.role, status: admin.status },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, stack: err.stack });
  }
});

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
