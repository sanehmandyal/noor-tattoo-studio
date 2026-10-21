import { Router } from 'express';
import {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/gallery', getGallery);
router.get('/gallery/:key', getGalleryItem);

// Admin routes
router.post('/admin/gallery', auth('admin', 'editor'), createGalleryItem);
router.put('/admin/gallery/:id', auth('admin', 'editor'), updateGalleryItem);
router.delete('/admin/gallery/:id', auth('admin', 'editor'), deleteGalleryItem);

export default router;
