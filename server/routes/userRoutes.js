import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/users', auth('super_admin'), getUsers);
router.post('/users', auth('super_admin'), createUser);
router.put('/users/:id', auth('super_admin'), updateUser);
router.delete('/users/:id', auth('super_admin'), deleteUser);

export default router;
