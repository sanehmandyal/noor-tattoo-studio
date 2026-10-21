import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User.js';
import { wrap, httpErr } from '../middleware/errorHandler.js';

const sanitizeUser = u => ({
  _id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  status: u.status,
  lastLogin: u.lastLogin
});

const userSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  role: z.enum(['super_admin', 'admin', 'editor']),
  status: z.enum(['active', 'disabled']).default('active'),
  password: z.string().min(12).optional()
});

export const getUsers = wrap(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ items: users.map(sanitizeUser) });
});

export const createUser = wrap(async (req, res) => {
  const body = userSchema.parse(req.body);
  if (!body.password) {
    throw httpErr(400, 'Password (12+ chars) is required');
  }

  const hashedPassword = await bcrypt.hash(body.password, 12);
  const created = await User.create({ ...body, password: hashedPassword });
  res.status(201).json(sanitizeUser(created));
});

export const updateUser = wrap(async (req, res) => {
  const body = userSchema.partial().parse(req.body);

  if (
    req.params.id === req.user.id &&
    ((body.role && body.role !== 'super_admin') || (body.status && body.status !== 'active'))
  ) {
    throw httpErr(400, 'You cannot demote or disable your own account');
  }

  if (body.password) {
    body.password = await bcrypt.hash(body.password, 12);
  }

  const updated = await User.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true
  });

  if (!updated) throw httpErr(404, 'Not found');
  res.json(sanitizeUser(updated));
});

export const deleteUser = wrap(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw httpErr(400, 'You cannot delete your own account');
  }

  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) throw httpErr(404, 'Not found');
  res.json({ ok: true });
});
