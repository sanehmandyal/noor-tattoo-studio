import mongoose from 'mongoose';
import { timestampOpts } from './helpers.js';

const { Schema, model } = mongoose;

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true },
    service: { type: String, default: 'Custom Tattoo' },
    location: { type: String, default: 'Una, Himachal Pradesh' },
    verified: { type: Boolean, default: true },
    source: { type: String, default: 'Google Maps' },
    image: String,
    featured: Boolean
  },
  timestampOpts
);

export const Testimonial = mongoose.models.Testimonial || model('Testimonial', testimonialSchema);
export default Testimonial;
