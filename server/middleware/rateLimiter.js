import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: { message: 'Too many requests from this IP, please try again later.' }
});

export const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: 'Too many attempts, try later' }
});

export const formLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { message: 'Too many submissions, try later' }
});

export const uploadLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { message: 'Too many upload attempts, try later' }
});
