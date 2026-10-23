import { Router } from 'express';
import { handleImageUpload, serveMedia } from '../controllers/uploadController.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadLimit } from '../middleware/rateLimiter.js';

const router = Router();

// Public permanent media stream from MongoDB (serves /api/media/:id)
router.get('/media/:id', serveMedia);

// Admin authenticated upload
router.post(
  '/admin/upload',
  auth('admin', 'editor'),
  upload.single('image'),
  handleImageUpload
);

// Public reference image upload for booking form
router.post(
  '/upload/reference',
  uploadLimit,
  upload.single('image'),
  handleImageUpload
);

export default router;
