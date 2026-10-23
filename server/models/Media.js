import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    mimeType: { type: String, default: 'image/webp' },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);
export default Media;
