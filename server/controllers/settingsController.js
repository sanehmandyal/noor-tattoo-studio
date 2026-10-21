import { Settings } from '../models/Settings.js';
import { BlogPost } from '../models/BlogPost.js';
import { Artist } from '../models/Artist.js';
import { Gallery } from '../models/Gallery.js';
import { wrap } from '../middleware/errorHandler.js';

export const getSettings = wrap(async (req, res) => {
  const settings = (await Settings.findOne({ key: 'main' })) || {};
  res.json(settings);
});

export const updateSettings = wrap(async (req, res) => {
  const updated = await Settings.findOneAndUpdate(
    { key: 'main' },
    { ...req.body, key: 'main' },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json(updated);
});

export const getSitemapXml = wrap(async (req, res) => {
  const base = (process.env.CLIENT_URL || '').replace(/\/$/, '');
  const [posts, artists, gallery] = await Promise.all([
    BlogPost.find({ published: true }).select('slug updatedAt'),
    Artist.find().select('slug'),
    Gallery.find().select('slug')
  ]);

  const urls = [
    '',
    '/about',
    '/artists',
    '/gallery',
    '/pricing',
    '/blog',
    '/faq',
    '/contact',
    '/booking'
  ]
    .map(u => base + u)
    .concat(
      posts.map(x => `${base}/blog/${x.slug}`),
      artists.map(x => `${base}/artists/${x.slug}`),
      gallery.map(x => `${base}/gallery/${x.slug}`)
    );

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map(u => `<url><loc>${u}</loc></url>`)
    .join('')}</urlset>`;

  res.type('application/xml').send(xml);
});
