import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists for local development
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

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return new Promise((resolve, reject) => {
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
  }

  const fileName = `${crypto.randomUUID()}.webp`;
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, optimizedBuffer);
  return `/uploads/${fileName}`;
};
