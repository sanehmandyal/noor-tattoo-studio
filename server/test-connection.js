import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function verify() {
  console.log('=== NOOR TATTOOZ STUDIO SYSTEM DIAGNOSTIC ===');
  console.log('1. Checking Environment Variables...');
  console.log('PORT:', process.env.PORT);
  console.log('CLIENT_URL:', process.env.CLIENT_URL);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('MONGODB_URI configured:', !!process.env.MONGODB_URI);
  console.log('JWT_SECRET configured:', !!process.env.JWT_SECRET);

  console.log('\n2. Testing MongoDB Atlas Connectivity...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'noor-tattoo-studio',
      serverSelectionTimeoutMS: 8000
    });
    console.log('✓ Successfully connected to MongoDB Atlas!');
  } catch (err) {
    console.error('✗ MongoDB Atlas Connection Failed:', err.message);
    process.exit(1);
  }

  console.log('\n3. Inspecting Database Collections & Seed Data...');
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections present:', collections.map(c => c.name));

  const User = mongoose.model('UserVerify', new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    status: String,
    name: String
  }), 'users');

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@noortattoo.com').toLowerCase().trim();
  const adminUser = await User.findOne({ email: adminEmail });

  if (!adminUser) {
    console.warn(`⚠️ Super admin user ${adminEmail} not found in DB!`);
  } else {
    console.log(`✓ Admin user exists: ${adminUser.name} (${adminUser.email}) - Role: ${adminUser.role}, Status: ${adminUser.status}`);
    const passwordValid = await bcrypt.compare(process.env.ADMIN_PASSWORD || 'Admin@NoorTattoo2026!', adminUser.password);
    console.log(`✓ Admin Password Verification against .env: ${passwordValid ? 'MATCHES (Login will succeed)' : 'DOES NOT MATCH'}`);
  }

  // Check counts
  for (const col of collections) {
    const count = await mongoose.connection.db.collection(col.name).countDocuments();
    console.log(`  - ${col.name}: ${count} documents`);
  }

  await mongoose.disconnect();
  console.log('\n✓ Diagnostic complete. Disconnected cleanly.');
}

verify().catch(e => {
  console.error('Diagnostic error:', e);
  process.exit(1);
});
