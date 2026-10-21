import { Booking } from '../models/Booking.js';
import { Inquiry } from '../models/Inquiry.js';
import { Artist } from '../models/Artist.js';
import { Gallery } from '../models/Gallery.js';
import { BlogPost } from '../models/BlogPost.js';
import { wrap } from '../middleware/errorHandler.js';

export const getStats = wrap(async (req, res) => {
  const [
    bookings,
    pending,
    confirmed,
    inquiries,
    artists,
    gallery,
    posts
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'confirmed' }),
    Inquiry.countDocuments(),
    Artist.countDocuments(),
    Gallery.countDocuments(),
    BlogPost.countDocuments({ published: true })
  ]);

  res.json({ bookings, pending, confirmed, inquiries, artists, gallery, posts });
});

export const getChartData = wrap(async (req, res) => {
  const since = new Date();
  since.setMonth(since.getMonth() - 5, 1);
  since.setHours(0, 0, 0, 0);

  const [byStatus, perMonth] = await Promise.all([
    Booking.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          n: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({
    byStatus: byStatus.map(x => [x._id, x.n]),
    perMonth: perMonth.map(x => [x._id, x.n])
  });
});
