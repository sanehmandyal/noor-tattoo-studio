import mongoose from 'mongoose';
import { timestampOpts } from './helpers.js';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['super_admin', 'admin', 'editor'], default: 'editor' },
    status: { type: String, default: 'active' },
    lastLogin: Date,
    resetToken: { type: String, select: false },
    resetExpires: Date
  },
  timestampOpts
);

export const User = mongoose.models.User || model('User', userSchema);
export default User;
