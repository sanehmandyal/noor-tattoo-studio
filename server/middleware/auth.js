import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { wrap, httpErr } from './errorHandler.js';

export const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 864e5
};

export const auth = (...roles) =>
  wrap(async (req, res, next) => {
    try {
      const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
      if (!token) throw httpErr(401, 'Unauthorized');

      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const u = await User.findById(id);

      if (!u || u.status !== 'active') throw httpErr(401, 'Unauthorized');
      if (roles.length && !roles.includes(u.role) && u.role !== 'super_admin') {
        throw httpErr(403, 'Forbidden');
      }

      req.user = u;
      next();
    } catch (e) {
      next(e.status ? e : httpErr(401, 'Unauthorized'));
    }
  });

export default auth;
