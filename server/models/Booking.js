import mongoose from 'mongoose';
import { timestampOpts } from './helpers.js';

const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    date: String,
    time: String,
    artist: { type: Schema.Types.ObjectId, ref: 'Artist' },
    style: String,
    placement: String,
    size: String,
    budget: String,
    description: String,
    referenceImage: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
      index: true
    },
    notes: String
  },
  timestampOpts
);

export const Booking = mongoose.models.Booking || model('Booking', bookingSchema);
export default Booking;
