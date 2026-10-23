import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';
import { Media } from '../models/Media.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists for local development/cache
try {
  await fs.mkdir(uploadsDir, { recursive: true });
} catch {
  // Directory already exists or cannot be created
}

export const storeImage = async buffer => {
  const optimizedBuffer = await sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // 1. If Cloudinary credentials are fully configured, use Cloudinary CDN
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const cloudinaryUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'noor-tattoo', resource_type: 'image' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          )
          .end(optimizedBuffer);
      });
      return cloudinaryUrl;
    } catch (cldErr) {
      console.warn('Cloudinary upload warning (falling back to persistent MongoDB storage):', cldErr.message);
    }
  }

  // 2. Persistent Storage in MongoDB (survives all server restarts, redeployments & container resets)
  try {
    const fileName = `${crypto.randomUUID()}.webp`;
    const mediaDoc = await Media.create({
      fileName,
      mimeType: 'image/webp',
      data: optimizedBuffer,
      size: optimizedBuffer.length
    });

    // Also mirror to local disk cache for fast local serving
    try {
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, optimizedBuffer);
    } catch {}

    return `/api/media/${mediaDoc._id}`;
  } catch (dbErr) {
    console.error('MongoDB media storage error:', dbErr.message);
    // 3. Fallback to local uploads if DB write fails
    const fileName = `${crypto.randomUUID()}.webp`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, optimizedBuffer);
    return `/uploads/${fileName}`;
  }
};
