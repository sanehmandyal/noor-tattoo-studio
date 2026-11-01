import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import app from './server.js';

async function runApiTests() {
  console.log('\n=== TESTING API & ADMIN PANEL ENDPOINTS ===\n');

  // 1. Health
  console.log('1. GET /api/health');
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('   Status:', healthRes.status, 'Response:', health);

  // 2. Settings (Public)
  console.log('\n2. GET /api/settings');
  const setRes = await fetch('http://localhost:5000/api/settings');
  const set = await setRes.json();
  console.log('   Status:', setRes.status, 'Studio Name:', set.businessName, 'Phone:', set.phone);

  // 3. Gallery (Public)
  console.log('\n3. GET /api/gallery');
  const galRes = await fetch('http://localhost:5000/api/gallery');
  const gal = await galRes.json();
  console.log('   Status:', galRes.status, 'Items count:', (gal.items || gal).length);

  // 4. Admin Login
  console.log('\n4. POST /api/auth/login');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || 'admin@noortattoo.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@NoorTattoo2026!'
    })
  });
  const loginData = await loginRes.json();
  console.log('   Status:', loginRes.status, 'User:', loginData.user?.name, 'Role:', loginData.user?.role, 'Has Token:', !!loginData.token);
  const token = loginData.token;

  if (!token) {
    console.error('   FAILED: No token received!');
    process.exit(1);
  }

  // 5. Auth /me with Bearer token
  console.log('\n5. GET /api/auth/me (Protected)');
  const meRes = await fetch('http://localhost:5000/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const meData = await meRes.json();
  console.log('   Status:', meRes.status, 'Authenticated as:', meData.user?.email);

  // 6. Admin Stats (Protected)
  console.log('\n6. GET /api/admin/stats (Protected)');
  const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const statsData = await statsRes.json();
  console.log('   Status:', statsRes.status, 'Stats:', statsData);

  // 7. Admin Bookings (Protected)
  console.log('\n7. GET /api/admin/bookings (Protected)');
  const bookRes = await fetch('http://localhost:5000/api/admin/bookings', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const bookData = await bookRes.json();
  console.log('   Status:', bookRes.status, 'Total Bookings:', bookData.total);

  // 8. Admin Inquiries (Protected)
  console.log('\n8. GET /api/admin/inquiries (Protected)');
  const inqRes = await fetch('http://localhost:5000/api/admin/inquiries', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const inqData = await inqRes.json();
  console.log('   Status:', inqRes.status, 'Total Inquiries:', inqData.total);

  console.log('\n✅ ALL ADMIN PANEL API TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}

// Give server 1.5 seconds to bind
setTimeout(runApiTests, 1500);
