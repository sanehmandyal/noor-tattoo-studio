import { Router } from 'express';
import {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist
} from '../controllers/artistController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/artists', getArtists);
router.get('/artists/:key', getArtist);

// Admin routes
router.post('/admin/artists', auth('admin', 'editor'), createArtist);
router.put('/admin/artists/:id', auth('admin', 'editor'), updateArtist);
router.delete('/admin/artists/:id', auth('admin', 'editor'), deleteArtist);

export default router;
