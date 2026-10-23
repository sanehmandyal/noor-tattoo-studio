import { wrap, httpErr } from '../middleware/errorHandler.js';
import { storeImage } from '../services/storageService.js';
import { Media } from '../models/Media.js';

export const handleImageUpload = wrap(async (req, res) => {
  if (!req.file) {
    throw httpErr(400, 'No image provided');
  }
  const url = await storeImage(req.file.buffer);
  res.json({ url });
});

export const serveMedia = wrap(async (req, res) => {
  const { id } = req.params;
  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    throw httpErr(404, 'Media not found');
  }
  const media = await Media.findById(id);
  if (!media || !media.data) {
    throw httpErr(404, 'Media not found');
  }
  res.set({
    'Content-Type': media.mimeType || 'image/webp',
    'Content-Length': media.size || media.data.length,
    'Cache-Control': 'public, max-age=31536000, immutable'
  });
  res.send(media.data);
});
