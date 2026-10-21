import mongoose from 'mongoose';
import { withSlug } from './helpers.js';

const { model } = mongoose;

const artistSchema = withSlug(
  {
    name: { type: String, required: true },
    bio: String,
    image: String,
    imageAlt: String,
    experience: Number,
    styles: [String],
    specialties: [String],
    socialLinks: {
      instagram: String,
      facebook: String
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'away'],
      default: 'available'
    }
  },
  'name'
);

export const Artist = mongoose.models.Artist || model('Artist', artistSchema);
export default Artist;
