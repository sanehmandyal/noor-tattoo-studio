import multer from 'multer';
import { httpErr } from './errorHandler.js';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/i.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(httpErr(400, 'Only JPG, PNG or WebP images are allowed'));
    }
  }
});

export default upload;
