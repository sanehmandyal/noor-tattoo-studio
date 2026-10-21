import mongoose from 'mongoose';
import { timestampOpts } from './helpers.js';

const { Schema, model } = mongoose;

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true },
    image: String,
    featured: Boolean
  },
  timestampOpts
);

export const Testimonial = mongoose.models.Testimonial || model('Testimonial', testimonialSchema);
export default Testimonial;
