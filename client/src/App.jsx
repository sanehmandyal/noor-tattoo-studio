import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, Outlet, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Menu, X, MessageCircle, MapPin, Phone, Mail, Clock, ShieldCheck,
  Instagram, Facebook, Sparkles, Award, ArrowUpRight
} from 'lucide-react';
import { api, waLink } from './api.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const Booking = lazy(() => import('./pages/Booking.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const P = n => lazy(() => import('./pages/Pages.jsx').then(m => ({ default: m[n] })));
const [
  Artists, ArtistPage, Gallery, GalleryItem, Pricing, Blog, BlogPost, FAQ,
  About, Privacy, Terms, Styles, StylePage, Process, Hygiene, Aftercare
] = [
  'Artists', 'ArtistPage', 'Gallery', 'GalleryItem', 'Pricing', 'Blog', 'BlogPost', 'FAQ',
  'About', 'Privacy', 'Terms', 'Styles', 'StylePage', 'Process', 'Hygiene', 'Aftercare'
].map(P);

export const SEO = ({ title, description }) => (
  <Helmet>
    <title>{title} | Noor Tattooz Studio Una (H.P.)</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={window.location.origin + window.location.pathname} />
    <meta property="og:title" content={`${title} | Noor Tattooz Studio`} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="/logo.png" />
  </Helmet>
);

const navLinks = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/gallery', 'Portfolio'],
  ['/styles', 'Tattoo Styles'],
  ['/pricing', 'Services'],
  ['/blog', 'Blog'],
  ['/process', 'Process & Safety'],
  ['/contact', 'Contact']
];

function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [s, setS] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setS(r.data)).catch(() => {});
  }, []);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    name: s.businessName || 'Noor Tattooz Studio',
    url: window.location.origin,
    image: window.location.origin + '/logo.png',
    telephone: s.phone || '+91 82198 11181',
    email: s.email || 'appointments@noortattooz.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address || 'Una Amb Road, Near Sabji Mandi, Prem Nagar',
      addressLocality: 'Una',
      addressRegion: 'Himachal Pradesh',
      postalCode: '174303',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '31.4685',
      longitude: '76.2708'
    },
    openingHours: 'Mo-Su 10:00-20:30',
    sameAs: [
      s.instagram || 'https://www.instagram.com/noortattooz',
      s.facebook
    ].filter(Boolean)
  };

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);

  return (
    <>
      {/* Unified Solid Fixed Header (No gaps, no show-through) */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-[#04100b] border-b border-[#143526] ${
        scrolled ? 'shadow-2xl shadow-black/80' : 'shadow-md'
      }`}>
        {/* Top Studio Bar */}
        <div className="bg-[#020a06] border-b border-[#10291f] text-xs text-[#8aa399] py-1.5 px-4 hidden md:block">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-gold font-medium">
                <Sparkles size={13} />
                <span>Una Amb Road, Prem Nagar, Una (H.P.)</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#8aa399] hover:text-cream transition">
                <ShieldCheck size={13} className="text-emerald" />
                <span>Hospital-Grade Sterile Studio</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#8aa399]">
                <Clock size={13} />
                <span>Mon–Sun: 10 AM – 8:30 PM</span>
              </span>
            </div>

            <div className="flex items-center gap-5">
              <a
                href={s.instagram || "https://www.instagram.com/noortattooz"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-silver hover:text-gold transition font-medium"
              >
                <Instagram size={13} className="text-gold" />
                <span>@noortattooz</span>
              </a>
              {s.phone && (
                <a href={`tel:${s.phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 text-silver hover:text-gold transition">
                  <Phone size={12} />
                  <span>{s.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3" aria-label="Main Navigation">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" aria-label="Noor Tattooz Home">
            <img
              src="/logo.png"
              alt="Noor Tattooz Emblem"
              width="44"
              height="44"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl border border-gold/40 shadow-md group-hover:scale-105 transition-transform bg-[#05150f] p-0.5 object-cover shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-[0.18em] text-base sm:text-lg text-silver leading-tight group-hover:text-gold transition">
                NOOR
              </span>
              <div className="inline-block border border-gold/60 px-1 py-0.2 text-[8px] sm:text-[9px] font-bold tracking-[0.18em] text-gold uppercase rounded-sm bg-[#0a2016]/80 mt-0.5">
                TATTOOZ
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-5">
            {navLinks.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-xs xl:text-sm font-medium tracking-wide transition-colors whitespace-nowrap ${
                    isActive ? 'text-gold border-b-2 border-gold pb-0.5 font-semibold' : 'text-[#cfd9d4] hover:text-gold'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Prominent Call Button in Desktop Navbar */}
            <a
              href={`tel:${(s.phone || '8219811181').replace(/\s+/g, '')}`}
              className="glass-call-btn"
              aria-label="Call Noor Tattooz Studio"
              title="Call Noor Tattooz: 8219811181"
            >
              <Phone size={13} className="text-emerald fill-emerald/20 animate-pulse" />
              <span>CALL NOW</span>
            </a>

            <Link to="/booking" className="clay-btn !py-2 !px-3.5 xl:!py-2.5 xl:!px-4 !text-xs tracking-wider whitespace-nowrap">
              BOOK SESSION
            </Link>
          </div>

          {/* Mobile Right Controls: Call Button + Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:hidden">
            <a
              href={`tel:${(s.phone || '8219811181').replace(/\s+/g, '')}`}
              className="glass-call-btn !py-1.5 !px-2.5 !text-xs flex items-center gap-1 shrink-0"
              aria-label="Call Noor Tattooz"
            >
              <Phone size={12} className="text-emerald fill-emerald/20 animate-pulse" />
              <span>CALL</span>
            </a>

            <button
              className="p-1.5 sm:p-2 text-cream hover:text-gold focus:outline-none shrink-0"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown with Glassmorphism */}
        {open && (
          <div className="lg:hidden glass m-3 p-5 flex flex-col gap-3 rounded-2xl border border-gold/30 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            {navLinks.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="text-cream hover:text-gold text-sm sm:text-base py-1.5 border-b border-[#132c21] transition"
              >
                {label}
              </Link>
            ))}

            <div className="grid grid-cols-2 gap-2 pt-2 border-b border-[#132c21] pb-3 text-xs text-silver">
              <Link to="/hygiene" onClick={() => setOpen(false)} className="hover:text-gold">› Clinical Sterility</Link>
              <Link to="/aftercare" onClick={() => setOpen(false)} className="hover:text-gold">› Tattoo Aftercare</Link>
              <Link to="/faq" onClick={() => setOpen(false)} className="hover:text-gold">› Studio FAQ</Link>
              <Link to="/about" onClick={() => setOpen(false)} className="hover:text-gold">› About Studio</Link>
            </div>

            <a
              href={waLink(s.whatsapp || '8219811181', 'Hi Noor Tattooz Studio, I would like to get an instant price quote for a tattoo idea.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 py-2.5 w-full rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition"
            >
              <MessageCircle size={15} />
              <span>GET QUOTE ON WHATSAPP</span>
            </a>

            <a
              href={`tel:${(s.phone || '8219811181').replace(/\s+/g, '')}`}
              onClick={() => setOpen(false)}
              className="glass-call-btn !py-2.5 !w-full justify-center !text-xs sm:!text-sm flex items-center gap-2"
            >
              <Phone size={15} className="text-emerald fill-emerald/20" />
              <span>DIRECT CALL: {s.phone || '8219811181'}</span>
            </a>

            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="clay-btn text-center text-xs sm:text-sm !py-2.5"
            >
              RESERVE A SESSION
            </Link>

            <div className="pt-1 flex items-center justify-center text-center text-[11px] text-muted">
              <a
                href={s.instagram || "https://www.instagram.com/noortattooz"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold flex items-center justify-center gap-1.5 hover:underline"
              >
                <Instagram size={13} /> Follow on Instagram @noortattooz
              </a>
            </div>
          </div>
        )}
      </header>

      <Helmet>
        {s.googleVerification && <meta name="google-site-verification" content={s.googleVerification} />}
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>

      {/* Main Viewport */}
      <main className="pt-[60px] md:pt-[92px] min-h-screen">
        <Outlet />
      </main>

      {/* Floating Action Hub (Call + WhatsApp) */}
      <div
        className="fixed right-5 z-40 flex flex-col items-center gap-3"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <a
          href={`tel:${(s.phone || '8219811181').replace(/\s+/g, '')}`}
          aria-label="Call Noor Tattooz Studio"
          title="Direct Call: 8219811181"
          className="h-12 w-12 rounded-full grid place-items-center text-gold shadow-2xl hover:scale-110 active:scale-95 transition-transform glass border border-gold/40"
          style={{
            background: 'linear-gradient(135deg, rgba(8, 30, 21, 0.92), rgba(4, 16, 11, 0.96))',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Phone size={20} className="text-gold fill-gold/20" />
        </a>

        {s.whatsapp && (
          <a
            href={waLink(s.whatsapp, 'Hi Noor Tattooz! I would like to book a consultation or ask about a tattoo idea.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
            className="h-14 w-14 rounded-full grid place-items-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)'
            }}
          >
            <MessageCircle size={28} />
          </a>
        )}
      </div>

      {/* Luxury Forest Emerald & Burnished Gold Footer */}
      <footer className="border-t border-[#17382a] bg-[#020b07] mt-24 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <img src="/logo.png" alt="Noor Tattooz" width="50" height="50" className="rounded-xl border border-gold/40 bg-[#05150f] p-0.5" />
              <div>
                <h3 className="font-display text-xl text-silver tracking-widest leading-none">NOOR</h3>
                <span className="text-[10px] tracking-[0.25em] text-gold uppercase block mt-1 font-semibold">TATTOOZ · STUDIO</span>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">
              A premier custom tattoo atelier on Una Amb Road near Sabji Mandi, Prem Nagar, Una, Himachal Pradesh. Dedicated to bespoke artwork, fine-line elegance, dark realism, and clinical hospital-grade sterility.
            </p>
            <a
              href={s.instagram || "https://www.instagram.com/noortattooz"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold hover:text-cream transition px-3 py-1.5 rounded-lg bg-[#072017] border border-[#1b3e30]"
            >
              <Instagram size={14} />
              <span>@noortattooz</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-gold text-sm tracking-widest uppercase mb-4">Studio Navigation</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Home</Link></li>
              <li><Link to="/about" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> About Studio</Link></li>
              <li><Link to="/gallery" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Curated Portfolio</Link></li>
              <li><Link to="/styles" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Tattoo Styles</Link></li>
              <li><Link to="/pricing" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Custom Quotes & Estimates</Link></li>
              <li><Link to="/booking" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Book a Session</Link></li>
              <li><Link to="/contact" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Contact Atelier</Link></li>
            </ul>
          </div>

          {/* Client Care & Safety */}
          <div>
            <h4 className="font-display text-gold text-sm tracking-widest uppercase mb-4">Care & Safety</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/process" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> 6-Stage Process</Link></li>
              <li><Link to="/hygiene" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Clinical Sterility</Link></li>
              <li><Link to="/aftercare" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Complete Aftercare</Link></li>
              <li><Link to="/pricing" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Estimates & Custom Quotes</Link></li>
              <li><Link to="/faq" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Studio FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-cream transition flex items-center gap-1.5"><span className="text-gold/50">›</span> Studio Journal</Link></li>
            </ul>
          </div>

          {/* Studio Visit Info */}
          <div>
            <h4 className="font-display text-gold text-sm tracking-widest uppercase mb-4">Studio Atelier</h4>
            <div className="space-y-3 text-sm text-muted">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                <span>{s.address || 'Una Amb Road, Near Sabji Mandi, Prem Nagar, Una, Himachal Pradesh 174303'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-gold shrink-0" />
                <a href={`tel:${(s.phone || '+918219811181').replace(/\s+/g, '')}`} className="hover:text-cream">
                  {s.phone || '+91 82198 11181'}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-gold shrink-0" />
                <a href={`mailto:${s.email || 'appointments@noortattooz.com'}`} className="hover:text-cream">
                  {s.email || 'appointments@noortattooz.com'}
                </a>
              </p>
              <p className="flex items-start gap-2 pt-1 border-t border-[#132c21]">
                <Clock size={15} className="text-gold shrink-0 mt-0.5" />
                <span className="text-xs whitespace-pre-line">{s.hours || 'Mon–Sun: 10 AM – 8:30 PM\n(Appointments & Walk-ins Welcome)'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="max-w-6xl mx-auto px-4 pt-8 border-t border-[#10291f] flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {new Date().getFullYear()} {s.businessName || 'Noor Tattooz Studio'}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-cream transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cream transition">Studio Terms & Policies</Link>
            <Link to="/admin" className="text-gold/60 hover:text-gold transition">Admin Panel</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

const NotFound = () => (
  <div className="text-center py-32 px-4 max-w-xl mx-auto">
    <SEO title="Page Not Found" description="The requested tattoo studio page was not found." />
    <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-3 font-semibold">Error 404</span>
    <h1 className="text-5xl font-bold mb-4">LOST IN THE SHADOWS</h1>
    <p className="text-muted mb-8 leading-relaxed">
      The piece or page you were searching for does not exist or has been relocated to another gallery wing.
    </p>
    <Link to="/" className="clay-btn">RETURN TO HOME</Link>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen grid place-items-center bg-bg text-gold">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="Loading Noor Tattooz..." width="68" height="68" className="rounded-xl animate-pulse border border-gold/40 bg-[#05150f] p-1 shadow-2xl" />
          <p className="text-xs tracking-widest uppercase text-muted font-semibold">Illuminating Artwork…</p>
        </div>
      </div>
    }>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="booking" element={<Booking />} />
          <Route path="about" element={<About />} />
          <Route path="artists" element={<Navigate to="/about" replace />} />
          <Route path="artists/:slug" element={<Navigate to="/about" replace />} />
          <Route path="styles" element={<Styles />} />
          <Route path="styles/:style" element={<StylePage />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/:slug" element={<GalleryItem />} />
          <Route path="process" element={<Process />} />
          <Route path="hygiene" element={<Hygiene />} />
          <Route path="aftercare" element={<Aftercare />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}
