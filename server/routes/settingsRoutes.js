import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  getSitemapXml
} from '../controllers/settingsController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/settings', getSettings);
router.put('/admin/settings', auth('admin'), updateSettings);
router.get('/sitemap.xml', getSitemapXml);

export default router;
