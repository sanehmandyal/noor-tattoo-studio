import { wrap, httpErr } from '../middleware/errorHandler.js';
import { storeImage } from '../services/storageService.js';

export const handleImageUpload = wrap(async (req, res) => {
  if (!req.file) {
    throw httpErr(400, 'No image provided');
  }
  const url = await storeImage(req.file.buffer);
  res.json({ url });
});
