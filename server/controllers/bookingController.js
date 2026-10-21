import { z } from 'zod';
import { Booking } from '../models/Booking.js';
import { wrap, httpErr } from '../middleware/errorHandler.js';
import { mail } from '../services/emailService.js';
import { waNotify } from '../services/whatsappService.js';

const bookingSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  date: z.string().min(1),
  time: z.string().min(1),
  artist: z.string().regex(/^[a-f\d]{24}$/i).optional().or(z.literal('')),
  style: z.string().max(60),
  placement: z.string().min(2).max(60),
  size: z.string().max(40),
  budget: z.string().max(40).optional(),
  description: z.string().min(10).max(2000),
  referenceImage: z
    .string()
    .regex(/^(\/uploads\/[\w.-]+|https:\/\/res\.cloudinary\.com\/[\w\/.-]+)$/)
    .optional()
    .or(z.literal(''))
});

export const createBooking = wrap(async (req, res) => {
  const data = bookingSchema.parse(req.body);
  if (!data.artist) delete data.artist;

  const booking = await Booking.create(data);

  mail(
    `New booking request: ${booking.name}`,
    `${booking.name} (${booking.email}, ${booking.phone})\n${booking.date} ${booking.time}\n${booking.style} / ${booking.placement}\n${booking.description}`
  );

  waNotify(
    `New booking: ${booking.name}, ${booking.phone}, ${booking.date} ${booking.time}, ${booking.style}, ${booking.placement}`
  );

  res.status(201).json({
    message: 'Request received. We will contact you to confirm.'
  });
});

export const getBookings = wrap(async (req, res) => {
  const { status, q, page = 1 } = req.query;
  const filter = {};

  if (typeof status === 'string' && status) filter.status = status;
  if (typeof q === 'string' && q) {
    const escaped = q.slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { name: new RegExp(escaped, 'i') },
      { email: new RegExp(escaped, 'i') }
    ];
  }

  const parsedPage = Math.max(+page || 1, 1);
  const limit = 20;

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .populate('artist')
      .sort('-createdAt')
      .skip((parsedPage - 1) * limit)
      .limit(limit),
    Booking.countDocuments(filter)
  ]);

  res.json({ items, total, page: parsedPage, pages: Math.ceil(total / limit) });
});

export const updateBooking = wrap(async (req, res) => {
  const allowed = (({ status, notes, artist }) => ({ status, notes, artist }))(req.body);
  Object.keys(allowed).forEach(k => allowed[k] === undefined && delete allowed[k]);

  const updated = await Booking.findByIdAndUpdate(req.params.id, allowed, {
    new: true,
    runValidators: true
  });
  if (!updated) throw httpErr(404, 'Not found');
  res.json(updated);
});

export const deleteBooking = wrap(async (req, res) => {
  const deleted = await Booking.findByIdAndDelete(req.params.id);
  if (!deleted) throw httpErr(404, 'Not found');
  res.json({ ok: true });
});
