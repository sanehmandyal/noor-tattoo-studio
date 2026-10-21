// Creates the first Super Admin from ADMIN_EMAIL / ADMIN_PASSWORD env vars and a few DEMO records.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as M from '../models/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { ADMIN_EMAIL: e, ADMIN_PASSWORD: p } = process.env;
const uri = process.env.MONGODB_URI?.trim();

if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri)) {
  console.error('Set MONGODB_URI in server/.env to a MongoDB connection string starting with mongodb:// or mongodb+srv://');
  process.exit(1);
}
if (!e || !p || p.length < 12) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) in server/.env');
  process.exit(1);
}

await mongoose.connect(uri);

if (!(await M.User.findOne({ email: e }))) {
  await M.User.create({
    name: 'Super Admin',
    email: e,
    password: await bcrypt.hash(p, 12),
    role: 'super_admin'
  });
}

if (!(await M.Service.countDocuments())) {
  await M.Service.create([
    { title: 'Custom Tattoo', description: 'DEMO: a one-of-a-kind design drawn with you.', price: 3000, duration: '2-6 hours' },
    { title: 'Fine Line Tattoo', description: 'DEMO: delicate single-needle work.', price: 2000, duration: '1-3 hours' },
    { title: 'Tattoo Consultation', description: 'DEMO: plan your piece with an artist.', price: 0, duration: '30 min' }
  ]);
  await M.Artist.create({
    name: 'Demo Artist',
    bio: 'DEMO record - replace with a real artist.',
    experience: 5,
    styles: ['Fine Line', 'Blackwork']
  });
  await M.FAQ.create([
    { question: 'How should I care for a new tattoo?', answer: 'DEMO: keep it clean, moisturised and out of direct sun. Follow your artist\'s aftercare sheet.' }
  ]);
}

console.log('Seed complete (records marked DEMO are samples)');
process.exit(0);
