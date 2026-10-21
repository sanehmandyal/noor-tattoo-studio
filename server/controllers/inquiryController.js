import { z } from 'zod';
import { Inquiry } from '../models/Inquiry.js';
import { wrap, httpErr } from '../middleware/errorHandler.js';
import { mail } from '../services/emailService.js';
import { waNotify } from '../services/whatsappService.js';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().min(2).max(150),
  message: z.string().min(10).max(3000)
});

export const createInquiry = wrap(async (req, res) => {
  const data = contactSchema.parse(req.body);
  const inquiry = await Inquiry.create(data);

  mail(
    `New inquiry: ${inquiry.subject}`,
    `${inquiry.name} (${inquiry.email})\n${inquiry.message}`
  );

  waNotify(`New inquiry from ${inquiry.name} (${inquiry.email}): ${inquiry.subject}`);

  res.status(201).json({ message: 'Message sent. Thank you!' });
});

export const getInquiries = wrap(async (req, res) => {
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
    Inquiry.find(filter)
      .sort('-createdAt')
      .skip((parsedPage - 1) * limit)
      .limit(limit),
    Inquiry.countDocuments(filter)
  ]);

  res.json({ items, total, page: parsedPage, pages: Math.ceil(total / limit) });
});

export const updateInquiry = wrap(async (req, res) => {
  const allowed = (({ status, notes }) => ({ status, notes }))(req.body);
  Object.keys(allowed).forEach(k => allowed[k] === undefined && delete allowed[k]);

  const updated = await Inquiry.findByIdAndUpdate(req.params.id, allowed, {
    new: true,
    runValidators: true
  });
  if (!updated) throw httpErr(404, 'Not found');
  res.json(updated);
});

export const deleteInquiry = wrap(async (req, res) => {
  const deleted = await Inquiry.findByIdAndDelete(req.params.id);
  if (!deleted) throw httpErr(404, 'Not found');
  res.json({ ok: true });
});
