import mongoose from 'mongoose';
import { timestampOpts } from './helpers.js';

const { Schema, model } = mongoose;

const settingFields = [
  'siteTitle',
  'description',
  'keywords',
  'city',
  'businessName',
  'address',
  'phone',
  'email',
  'hours',
  'instagram',
  'facebook',
  'whatsapp',
  'mapsUrl',
  'ogImage',
  'heroImage',
  'aboutImage',
  'googleVerification'
];

const settingsSchema = new Schema(
  {
    key: { type: String, default: 'main', unique: true },
    ...Object.fromEntries(settingFields.map(k => [k, String]))
  },
  timestampOpts
);

export const Settings = mongoose.models.Settings || model('Settings', settingsSchema);
export default Settings;
