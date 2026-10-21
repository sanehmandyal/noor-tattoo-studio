import mongoose from 'mongoose';
import { withSlug } from './helpers.js';

const { Schema, model } = mongoose;

const gallerySchema = withSlug({
  title: { type: String, required: true },
  image: { type: String, required: true },
  imageAlt: String,
  category: { type: String, index: true },
  style: { type: String, index: true },
  placement: String,
  artist: { type: Schema.Types.ObjectId, ref: 'Artist' },
  description: String,
  tags: [String],
  featured: { type: Boolean, default: false }
});

export const Gallery = mongoose.models.Gallery || model('Gallery', gallerySchema);
export default Gallery;
