import { Router } from 'express';
import {
  getPosts,
  getPost,
  getAdminPosts,
  createPost,
  updatePost,
  deletePost
} from '../controllers/blogController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/blog', getPosts);
router.get('/blog/:key', getPost);

// Admin routes
router.get('/admin/blog', auth('admin', 'editor'), getAdminPosts);
router.post('/admin/blog', auth('admin', 'editor'), createPost);
router.put('/admin/blog/:id', auth('admin', 'editor'), updatePost);
router.delete('/admin/blog/:id', auth('admin', 'editor'), deletePost);

export default router;
