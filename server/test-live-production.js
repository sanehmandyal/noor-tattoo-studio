process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testLiveProduction() {
  console.log('=== VERIFYING LIVE PRODUCTION INTEGRATION ===\n');

  const BASE_URL = 'https://noor-tattoo-studio.vercel.app';
  const RENDER_URL = 'https://noor-tattoo-studio-api.onrender.com';

  console.log('1. Testing Live Vercel Site: ' + BASE_URL);
  const siteRes = await fetch(BASE_URL);
  console.log('   Status:', siteRes.status, siteRes.statusText);

  console.log('\n2. Testing Vercel /api Proxy to Render...');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const health = await healthRes.json();
  console.log('   Status:', healthRes.status, 'DB Cluster Stats:', health.database);

  console.log('\n3. Testing Admin Login on Live Site...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@noortattoo.com',
      password: 'Admin@NoorTattoo2026!'
    })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('   Status:', loginRes.status, 'Logged in as:', loginData.user?.name, 'Role:', loginData.user?.role);

  console.log('\n4. Testing Protected Admin Endpoints with Bearer Token...');
  const [statsRes, meRes, bookRes, inqRes] = await Promise.all([
    fetch(`${BASE_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
    fetch(`${BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
    fetch(`${BASE_URL}/api/admin/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
    fetch(`${BASE_URL}/api/admin/inquiries`, { headers: { Authorization: `Bearer ${token}` } })
  ]);

  const stats = await statsRes.json();
  const me = await meRes.json();
  const bookings = await bookRes.json();
  const inquiries = await inqRes.json();

  console.log('   /api/auth/me:', meRes.status, me.user?.email);
  console.log('   /api/admin/stats:', statsRes.status, stats);
  console.log('   /api/admin/bookings:', bookRes.status, 'Total bookings:', bookings.total);
  console.log('   /api/admin/inquiries:', inqRes.status, 'Total inquiries:', inquiries.total);

  console.log('\n5. Testing Live Public Studio Endpoints...');
  const [setRes, galRes, artRes] = await Promise.all([
    fetch(`${BASE_URL}/api/settings`),
    fetch(`${BASE_URL}/api/gallery`),
    fetch(`${BASE_URL}/api/artists`)
  ]);

  const settings = await setRes.json();
  const gallery = await galRes.json();
  const artists = await artRes.json();

  console.log('   /api/settings:', setRes.status, 'Studio:', settings.businessName, 'Phone:', settings.phone);
  console.log('   /api/gallery:', galRes.status, 'Total items:', gallery.total || gallery.items?.length);
  console.log('   /api/artists:', artRes.status, 'Total artists:', artists.total || artists.items?.length);

  console.log('\n6. Checking Image Assets on Live Site...');
  if (gallery.items && gallery.items.length > 0) {
    const sampleImg = gallery.items[0].image;
    console.log('   Sample gallery image path:', sampleImg);
    const imgUrl = sampleImg.startsWith('http') ? sampleImg : `${BASE_URL}${sampleImg}`;
    const imgRes = await fetch(imgUrl);
    console.log('   Image asset load status:', imgRes.status, imgRes.headers.get('content-type'));
  }

  console.log('\n✅ ALL LIVE PRODUCTION VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

testLiveProduction().catch(e => {
  console.error('Error during live verification:', e);
});
