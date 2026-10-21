import mongoose from 'mongoose';
import { timestampOpts } from './helpers.js';

const { Schema, model } = mongoose;

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: String,
    published: { type: Boolean, default: true }
  },
  timestampOpts
);

export const FAQ = mongoose.models.FAQ || model('FAQ', faqSchema);
export default FAQ;
