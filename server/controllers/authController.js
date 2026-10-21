import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { User } from '../models/User.js';
import { wrap, httpErr } from '../middleware/errorHandler.js';
import { cookieOpts } from '../middleware/auth.js';
import { mailTo } from '../services/emailService.js';

const sha256 = text => crypto.createHash('sha256').update(text).digest('hex');

export const login = wrap(async (req, res) => {
  const { email, password } = z
    .object({
      email: z.string().email(),
      password: z.string().min(1)
    })
    .parse(req.body);

  const user = await User.findOne({ email }).select('+password');
  if (!user || user.status !== 'active' || !(await bcrypt.compare(password, user.password))) {
    throw httpErr(401, 'Invalid credentials');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  res.cookie('token', token, cookieOpts);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export const logout = (req, res) => {
  res.clearCookie('token', cookieOpts).json({ ok: true });
};

export const getMe = (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

export const forgotPassword = wrap(async (req, res) => {
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  const user = await User.findOne({ email });

  if (user && user.status === 'active') {
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = sha256(rawToken);
    user.resetExpires = new Date(Date.now() + 36e5);
    await user.save();

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    await mailTo(
      user.email,
      'Reset your Noor Tattoo Studio admin password',
      `${clientUrl}/admin/reset/${rawToken}\nThis link is valid for 1 hour.`
    );
  }

  res.json({ message: 'If that account exists, a reset link has been sent.' });
});

export const resetPassword = wrap(async (req, res) => {
  const { token, password } = z
    .object({
      token: z.string().length(64),
      password: z.string().min(12)
    })
    .parse(req.body);

  const user = await User.findOne({
    resetToken: sha256(token),
    resetExpires: { $gt: new Date() }
  });

  if (!user) {
    throw httpErr(400, 'Reset link is invalid or expired');
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetToken = undefined;
  user.resetExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated. You can now sign in.' });
});
