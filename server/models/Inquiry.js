import mongoose from 'mongoose';
import { timestampOpts } from './helpers.js';

const { Schema, model } = mongoose;

const inquirySchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new'
    }
  },
  timestampOpts
);

export const Inquiry = mongoose.models.Inquiry || model('Inquiry', inquirySchema);
export default Inquiry;
