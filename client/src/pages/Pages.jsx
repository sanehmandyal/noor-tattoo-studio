import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Sparkles, Clock, CheckCircle2, Star, ArrowRight,
  Instagram, Facebook, MapPin, Phone, Mail, Award, Coffee, ChevronRight, X,
  MessageCircle, AlertCircle, Droplets, HeartPulse, Check, Calendar, ThumbsUp, Eye, Layers, Feather
} from 'lucide-react';
import { api, img, waLink } from '../api.js';
import { SEO } from '../App.jsx';

const STYLES = [
  'All', 'Realism', 'Fine Line', 'Black & Grey', 'Japanese', 'Minimalist',
  'Geometric', 'Neo-Traditional', 'Mandala', 'Floral', 'Portrait',
  'Lettering', 'Spiritual', 'Abstract', 'Sleeve', 'Custom Designs'
];

function useFetch(path) {
  const [d, setD] = useState(null), [err, setErr] = useState(false);
  useEffect(() => {
    setD(null);
    setErr(false);
    api.get(path).then(r => setD(r.data)).catch(() => setErr(true));
  }, [path]);
  return [d, err];
}

const Wrap = ({ title, desc, children, h, sub }) => (
  <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
    <SEO title={title} description={desc} />
    <div className="mb-10 text-center max-w-2xl mx-auto">
      {sub && <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-semibold">{sub}</span>}
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{h || title}</h1>
      {desc && <p className="text-muted text-sm sm:text-base mt-3 leading-relaxed">{desc}</p>}
    </div>
    {children}
  </div>
);

const State = ({ d, err, children }) => err ? (
  <div className="text-center py-16 clay p-8 max-w-lg mx-auto">
    <p className="text-muted mb-4">Could not load this section right now.</p>
    <button onClick={() => window.location.reload()} className="clay-btn ghost text-xs">TRY AGAIN</button>
  </div>
) : !d ? (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="clay h-64 animate-pulse" />)}
  </div>
) : d.items && !d.items.length ? (
  <div className="text-center py-16 clay p-8 max-w-lg mx-auto">
    <p className="text-muted">Nothing found matching your criteria. Check back soon!</p>
  </div>
) : children;

const Grid = ({ children }) => <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>;

// 1. ARTISTS LIST
export function Artists() {
  const [d, err] = useFetch('/artists?limit=50');
  return (
    <Wrap
      title="Resident Tattoo Masters"
      h="OUR RESIDENT ARTISTS"
      sub="Master Craftsmanship"
      desc="Meet the multidisciplinary resident artists of Noor Tattooz. Each master brings decades of dedicated study, distinct visual languages, and an empathetic chairside presence."
    >
      <State d={d} err={err}>
        <Grid>
          {d?.items.map(a => (
            <article key={a._id} className="clay p-6 flex flex-col justify-between group hover:-translate-y-1 transition duration-300">
              <div>
                <div className="relative mb-5 overflow-hidden rounded-2xl aspect-[4/5] bg-[#1a1a1e]">
                  <img
                    src={img(a.image)}
                    alt={a.imageAlt || a.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider shadow">
                    {a.status || 'Available'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-cream">{a.name}</h2>
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <span className="text-xs text-gold font-semibold">{a.experience} Years of Mastery</span>
                  <span className="text-muted text-xs">·</span>
                  <span className="text-xs text-muted">Una Resident Master</span>
                </div>
                <p className="text-xs text-muted line-clamp-3 leading-relaxed mb-4">
                  {a.bio}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {a.styles?.map(s => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-[#1d1d22] text-cream/90 border border-[#2b2b32]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-between">
                <Link to={`/artists/${a.slug}`} className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold">
                  View Portfolio <ChevronRight size={13} />
                </Link>
                <Link to={`/booking?artist=${a._id}`} className="clay-btn !py-1.5 !px-3 !text-[11px]">
                  BOOK SESSION
                </Link>
              </div>
            </article>
          ))}
        </Grid>
      </State>
    </Wrap>
  );
}

// 2. ARTIST PROFILE PAGE
export function ArtistPage() {
  const { slug } = useParams();
  const [a, err] = useFetch('/artists/' + slug);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    if (a?._id) {
      api.get(`/gallery?limit=12&artist=${a._id}`).then(r => setGallery(r.data.items || [])).catch(() => {});
    }
  }, [a]);

  return (
    <Wrap
      title={a?.name || 'Artist Profile'}
      h={a?.name}
      sub="Resident Master Profile"
      desc={a?.styles?.join(' · ')}
    >
      <State d={a} err={err}>
        {a && (
          <>
            <div className="grid md:grid-cols-12 gap-10 items-start mb-16">
              <div className="md:col-span-5">
                <div className="clay p-3 rounded-2xl overflow-hidden border border-gold/30">
                  <img
                    src={img(a.image)}
                    alt={a.name}
                    className="w-full h-auto rounded-xl object-cover aspect-[4/5]"
                  />
                </div>
              </div>

              <div className="md:col-span-7 clay p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-semibold text-gold tracking-widest uppercase">
                    {a.experience} Years Professional Experience
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Status: {a.status}
                  </span>
                </div>

                <h2 className="text-3xl font-bold mb-4">{a.name}</h2>
                <div className="text-sm text-muted leading-relaxed whitespace-pre-line mb-6">
                  {a.bio}
                </div>

                <div className="mb-6">
                  <h4 className="text-xs tracking-widest text-gold uppercase font-semibold mb-2">Signature Styles</h4>
                  <div className="flex flex-wrap gap-2">
                    {a.styles?.map(st => (
                      <span key={st} className="px-3 py-1 rounded bg-[#222228] text-xs text-cream border border-line">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {a.specialties?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs tracking-widest text-gold uppercase font-semibold mb-2">Technical Specialties</h4>
                    <p className="text-xs text-muted leading-relaxed">
                      {a.specialties.join(' · ')}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-line">
                  <Link to={`/booking?artist=${a._id}`} className="clay-btn">
                    BOOK A SESSION WITH {a.name.split(' ')[0].toUpperCase()}
                  </Link>
                  {a.socialLinks?.instagram && (
                    <a
                      href={a.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clay-btn ghost text-xs flex items-center gap-1.5"
                    >
                      <Instagram size={14} /> Instagram
                    </a>
                  )}
                  {a.socialLinks?.facebook && (
                    <a
                      href={a.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clay-btn ghost text-xs flex items-center gap-1.5"
                    >
                      <Facebook size={14} /> Facebook
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Artist Portfolio */}
            {gallery.length > 0 && (
              <div>
                <div className="text-center mb-8">
                  <span className="text-gold text-xs tracking-widest uppercase">Portfolio Works</span>
                  <h3 className="text-2xl font-bold mt-1">Artwork by {a.name}</h3>
                </div>
                <Grid>
                  {gallery.map(item => (
                    <Link
                      key={item._id}
                      to={`/gallery/${item.slug}`}
                      className="clay overflow-hidden group block"
                    >
                      <div className="aspect-square overflow-hidden bg-[#18181b]">
                        <img
                          src={img(item.image)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-cream group-hover:text-gold transition">{item.title}</h4>
                        <span className="text-xs text-muted block mt-1">{item.style}</span>
                      </div>
                    </Link>
                  ))}
                </Grid>
              </div>
            )}
          </>
        )}
      </State>
    </Wrap>
  );
}

// 3. GALLERY (PORTFOLIO)
export function Gallery() {
  const [style, setStyle] = useState('All');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pages, setPages] = useState(1);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  useEffect(() => { setPage(1); }, [style, q]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      const params = { q, page, limit: 12 };
      if (style !== 'All') params.style = style;
      api.get('/gallery', { params })
        .then(r => {
          setItems(prev => page === 1 ? r.data.items : [...prev, ...r.data.items]);
          setPages(r.data.pages);
          setErr(false);
        })
        .catch(() => setErr(true))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [style, q, page]);

  useEffect(() => {
    const esc = e => e.key === 'Escape' && setActiveModal(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  return (
    <Wrap
      title="Tattoo Portfolio & Gallery"
      h="TATTOO PORTFOLIO"
      sub="Living Masterpieces"
      desc="Explore curated tattoos created by our resident masters. Filter by art discipline or search by subject matter to find inspiration for your next permanent piece."
    >
      {/* Search & Style Filters */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Style Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {STYLES.map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition ${
                style === s
                  ? 'bg-gold text-[#111] shadow-md font-bold'
                  : 'bg-[#18181b] text-muted hover:text-cream border border-line'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search by keyword, tag..."
          value={q}
          onChange={e => setQ(e.target.value)}
          className="field max-w-xs text-xs"
          aria-label="Search tattoos"
        />
      </div>

      {err ? (
        <div className="text-center py-16 clay p-6 max-w-md mx-auto">
          <p className="text-muted mb-3">Unable to load the gallery at this time.</p>
          <button onClick={() => window.location.reload()} className="clay-btn ghost text-xs">RETRY</button>
        </div>
      ) : !loading && !items.length ? (
        <div className="text-center py-20 clay p-8 max-w-lg mx-auto">
          <p className="text-muted">No tattoo pieces match your selected style or search term.</p>
          <button onClick={() => { setStyle('All'); setQ(''); }} className="clay-btn ghost text-xs mt-4">RESET FILTERS</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(piece => (
            <div
              key={piece._id}
              onClick={() => setActiveModal(piece)}
              className="clay overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-[#161619]">
                <img
                  src={img(piece.image)}
                  alt={piece.imageAlt || piece.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="bg-[#0b0b0c]/85 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-semibold text-gold border border-gold/30">
                    {piece.style}
                  </span>
                  {piece.placement && (
                    <span className="bg-[#04100b]/85 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-medium text-silver border border-[#1b3e30]">
                      {piece.placement}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-cream group-hover:text-gold transition">{piece.title}</h3>
                <p className="text-xs text-muted mt-1">
                  Studio: <span className="text-cream">Noor Tattooz Atelier</span>
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-gold">
                  <span>View Details & Specs</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="text-center text-muted text-xs py-8">Loading artwork…</p>}

      {page < pages && !loading && (
        <div className="text-center mt-12">
          <button className="clay-btn ghost" onClick={() => setPage(p => p + 1)}>
            LOAD MORE PIECES
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeModal.title}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm grid place-items-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="clay p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gold/40"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gold font-semibold uppercase tracking-wider">{activeModal.style}</span>
                  {activeModal.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#0a261c] text-emerald border border-emerald/30 font-semibold uppercase">
                      {activeModal.category}
                    </span>
                  )}
                  {activeModal.placement && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#17171e] text-silver border border-line">
                      {activeModal.placement}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-cream mt-0.5">{activeModal.title}</h2>
                <p className="text-xs text-muted mt-1">Artist: {activeModal.artist?.name || 'Resident Master'}</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-muted hover:text-cream rounded-full bg-[#18181c] border border-line"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden mb-6 bg-[#121215]">
              <img
                src={img(activeModal.image)}
                alt={activeModal.imageAlt || activeModal.title}
                className="w-full max-h-[60vh] object-contain mx-auto"
              />
            </div>

            <p className="text-sm text-muted leading-relaxed mb-4 whitespace-pre-line">
              {activeModal.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {activeModal.tags?.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded bg-[#1e1e24] text-gold/80">
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line">
              <Link to={`/gallery/${activeModal.slug}`} className="text-xs text-gold hover:underline">
                Open dedicated page ›
              </Link>
              <div className="flex flex-wrap gap-2">
                <a
                  href={waLink(settings.whatsapp || '8219811181', `Hello Noor Tattooz Studio, I would like to get a custom price quote for "${activeModal.title}" (${activeModal.style}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clay-btn !py-2 !px-3 text-xs flex items-center gap-1.5 !bg-[#144230] hover:!bg-[#1c5d43] text-[#55f2a3] border border-[#23704f]"
                >
                  <MessageCircle size={14} className="text-[#55f2a3]" />
                  <span>Get WhatsApp Quote</span>
                </a>
                <Link to="/booking" className="clay-btn ghost !py-2 !px-4 text-xs">
                  BOOK SIMILAR PIECE
                </Link>
                <button className="clay-btn ghost !py-2 !px-4 text-xs" onClick={() => setActiveModal(null)}>
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrap>
  );
}

// 4. GALLERY ITEM DETAIL PAGE
export function GalleryItem() {
  const { slug } = useParams();
  const [g, err] = useFetch('/gallery/' + slug);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <Wrap
      title={g?.title || 'Tattoo Piece'}
      h={g?.title}
      sub={g?.style || 'Portfolio Piece'}
      desc={g?.description?.slice(0, 150)}
    >
      <State d={g} err={err}>
        {g && (
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-6 clay p-3 rounded-2xl overflow-hidden border border-gold/30">
              <img
                src={img(g.image)}
                alt={g.imageAlt || g.title}
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>

            <div className="md:col-span-6 clay p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                  Discipline: {g.style}
                </span>
                {g.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#0a261c] text-emerald border border-emerald/30 font-semibold uppercase">
                    Category: {g.category}
                  </span>
                )}
                {g.placement && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#17171e] text-silver border border-line">
                    Placement: {g.placement}
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-bold mb-4">{g.title}</h2>
              <p className="text-sm text-muted mb-4">
                Crafted At: <strong className="text-cream">Noor Tattooz Studio Una (H.P.)</strong>
              </p>

              <div className="text-sm text-muted leading-relaxed whitespace-pre-line mb-6">
                {g.description}
              </div>

              {g.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {g.tags.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded bg-[#1e1e24] text-gold/80 border border-line">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-6 border-t border-line flex flex-wrap gap-4">
                <a
                  href={waLink(settings.whatsapp || '8219811181', `Hello Noor Tattooz Studio, I would like to get a custom price quote for the "${g.title}" design (${g.style}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clay-btn flex items-center gap-2 !bg-[#144230] hover:!bg-[#1c5d43] text-[#55f2a3] border border-[#23704f]"
                >
                  <MessageCircle size={16} className="text-[#55f2a3]" />
                  <span>GET QUOTE ON WHATSAPP</span>
                </a>
                <Link to="/booking" className="clay-btn ghost">
                  REQUEST SIMILAR WORK
                </Link>
                <Link to="/gallery" className="clay-btn ghost text-xs">
                  BACK TO GALLERY
                </Link>
              </div>
            </div>
          </div>
        )}
      </State>
    </Wrap>
  );
}

// 5. SERVICES & CUSTOM ESTIMATES
export function Pricing() {
  const [d, err] = useFetch('/services?limit=50');
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <Wrap
      title="Custom Tattoo Estimates & Services"
      h="TATTOO ESTIMATES & QUOTES"
      sub="Bespoke Pricing via WhatsApp"
      desc="Every tattoo at Noor Tattooz Studio is 100% custom-crafted to your anatomy. Receive an immediate, tailored price quote and timeline estimate directly from our studio admin on WhatsApp."
    >
      {/* Studio Value & Transparency Banner */}
      <div className="clay p-6 mb-12 border border-gold/30 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">Instant Quote</span>
          <span className="text-xs text-muted">Direct on WhatsApp</span>
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold text-gold block">1-on-1 Studio</span>
          <span className="text-xs text-muted">Free In-Person Consult</span>
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">100% Free</span>
          <span className="text-xs text-muted">60-Day Touch-Up</span>
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold text-gold block">Included</span>
          <span className="text-xs text-muted">Medical Saniderm Shield</span>
        </div>
      </div>

      <State d={d} err={err}>
        <Grid>
          {d?.items.map(s => (
            <article key={s._id} className="clay p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="text-xl font-bold text-cream group-hover:text-gold transition">{s.title}</h2>
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald/15 text-emerald border border-emerald/30 whitespace-nowrap">
                    Custom Quote
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted mb-4">
                  <Clock size={13} className="text-gold" />
                  <span>Duration: {s.duration || 'Session Varies'}</span>
                </div>

                <p className="text-xs text-muted leading-relaxed mb-5">
                  {s.description}
                </p>

                {s.faqs?.length > 0 && (
                  <div className="space-y-2 mb-5">
                    {s.faqs.map((faq, i) => (
                      <details key={i} className="text-xs bg-[#161619] p-2.5 rounded-lg border border-line">
                        <summary className="font-semibold text-cream cursor-pointer">{faq.q}</summary>
                        <p className="text-muted mt-1.5 leading-relaxed">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <a
                  href={waLink(settings.whatsapp || '8219811181', `Hi Noor Tattooz Studio, I would like to get a custom price quote for "${s.title}".`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#144230] hover:bg-[#1c5d43] text-[#55f2a3] border border-[#23704f] transition shadow"
                >
                  <MessageCircle size={13} />
                  <span>GET QUOTE ON WHATSAPP</span>
                </a>
                <Link to="/booking" className="clay-btn ghost !py-1.5 !px-3 !text-xs">
                  BOOK NOW
                </Link>
              </div>
            </article>
          ))}
        </Grid>
      </State>

      {/* 4-Step Instant WhatsApp Quote Guide */}
      <section className="clay p-8 mt-16 max-w-4xl mx-auto border border-gold/30">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-bold block mb-1">Fast & Direct</span>
          <h3 className="text-2xl font-bold font-display text-cream">HOW TO GET AN INSTANT TATTOO QUOTE</h3>
          <p className="text-xs text-muted mt-1">Get an exact price estimate and timeframe directly from studio admin in 4 quick steps.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <span className="font-display text-2xl font-bold text-gold block mb-2">01</span>
            <strong className="text-cream text-xs block mb-1">Share Reference Photo</strong>
            <p className="text-[11px] text-muted leading-tight">Send sketches, inspiration photos, or your concept idea.</p>
          </div>
          <div className="glass-card p-4 text-center">
            <span className="font-display text-2xl font-bold text-gold block mb-2">02</span>
            <strong className="text-cream text-xs block mb-1">Body Placement</strong>
            <p className="text-[11px] text-muted leading-tight">Specify where you want it (forearm, neck, chest, back, ankle).</p>
          </div>
          <div className="glass-card p-4 text-center">
            <span className="font-display text-2xl font-bold text-gold block mb-2">03</span>
            <strong className="text-cream text-xs block mb-1">Approximate Dimensions</strong>
            <p className="text-[11px] text-muted leading-tight">Mention approx length/width in inches or centimeters.</p>
          </div>
          <div className="glass-card p-4 text-center">
            <span className="font-display text-2xl font-bold text-emerald block mb-2">04</span>
            <strong className="text-cream text-xs block mb-1">Get Exact Estimate</strong>
            <p className="text-[11px] text-muted leading-tight">Receive exact pricing, hours required, and appointment slots.</p>
          </div>
        </div>

        <div className="text-center pt-2">
          <a
            href={waLink(settings.whatsapp || '8219811181', 'Hi Noor Tattooz Studio, I would like to get an instant quote for my tattoo idea. Here are my details:\n- Placement:\n- Approx Size:\n- Style:\n')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold bg-[#144230] hover:bg-[#1c5d43] text-[#55f2a3] border border-[#23704f] transition shadow-lg"
          >
            <MessageCircle size={18} />
            <span>REQUEST AN INSTANT ESTIMATE ON WHATSAPP (8219811181)</span>
          </a>
        </div>
      </section>
    </Wrap>
  );
}

// 6. BLOG LIST
export function Blog() {
  const [d, err] = useFetch('/blog?limit=50');

  return (
    <Wrap
      title="Tattoo Studio Journal & Guides"
      h="STUDIO JOURNAL"
      sub="Education & Insights"
      desc="Explore expert articles on tattoo aftercare, healing science, pain management, single-needle longevity, and the philosophy of permanent self-expression."
    >
      <State d={d} err={err}>
        <Grid>
          {d?.items.map(post => (
            <article key={post._id} className="clay overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/9] bg-[#18181c] overflow-hidden">
                  <img
                    src={img(post.featuredImage)}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#0b0b0c]/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-gold uppercase font-medium">
                    {post.category || 'Article'}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-cream group-hover:text-gold transition leading-snug">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-xs text-muted mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-line flex items-center justify-between text-xs text-muted">
                <span>By {post.author}</span>
                <Link to={`/blog/${post.slug}`} className="text-gold hover:underline flex items-center gap-1 font-semibold">
                  Read Guide <ChevronRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </Grid>
      </State>
    </Wrap>
  );
}

// 7. SINGLE BLOG POST
export function BlogPost() {
  const { slug } = useParams();
  const [p, err] = useFetch('/blog/' + slug);

  const ld = p && {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt,
    author: { '@type': 'Person', name: p.author || 'Noor Tattooz' },
    image: p.featuredImage ? img(p.featuredImage) : undefined
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title={p?.seo?.title || p?.title || 'Studio Journal'}
        description={p?.seo?.description || p?.excerpt || 'Expert tattoo insights and guides.'}
      />
      {p && (
        <Helmet>
          {p.seo?.canonical && <link rel="canonical" href={p.seo.canonical} />}
          <script type="application/ld+json">{JSON.stringify(ld)}</script>
        </Helmet>
      )}

      <nav aria-label="Breadcrumb" className="text-xs text-muted mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-cream">Home</Link>
        <span>/</span>
        <Link to="/blog" className="hover:text-cream">Studio Journal</Link>
        <span>/</span>
        <span className="text-gold truncate max-w-[200px]">{p?.title}</span>
      </nav>

      <State d={p} err={err}>
        {p && (
          <article className="clay p-6 sm:p-10">
            <span className="text-xs text-gold uppercase tracking-widest font-semibold block mb-2">
              {p.category || 'Tattoo Guide'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{p.title}</h1>

            <div className="flex items-center gap-3 text-xs text-muted mb-8 pb-4 border-b border-line">
              <span>Written by <strong className="text-cream">{p.author}</strong></span>
              <span>·</span>
              <span>{p.publishedAt && new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>

            {p.featuredImage && (
              <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-[#161619]">
                <img src={img(p.featuredImage)} alt={p.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-invert max-w-none text-cream/90 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
              {p.content}
            </div>

            {/* Post CTA */}
            <div className="clay p-6 mt-12 bg-gradient-to-r from-[#17171c] to-[#1d1d24] text-center border border-gold/30">
              <h3 className="text-lg font-bold mb-2">Have questions about your tattoo concept?</h3>
              <p className="text-xs text-muted max-w-md mx-auto mb-4">
                Our resident artists are available for complimentary design consultations at our Una studio on Amb Road.
              </p>
              <Link to="/booking" className="clay-btn !py-2 !px-4 text-xs">
                SCHEDULE CONSULTATION
              </Link>
            </div>
          </article>
        )}
      </State>
    </div>
  );
}

// 8. FAQ PAGE
export function FAQ() {
  const [d, err] = useFetch('/faqs?limit=50');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Hygiene & Safety', 'Pricing & Bookings', 'The Experience', 'Preparation', 'Aftercare & Healing', 'Art & Design'];

  const filteredItems = d?.items?.filter(f => activeCategory === 'All' || f.category === activeCategory) || [];

  const ld = d && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.items.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
  };

  return (
    <Wrap
      title="Frequently Asked Questions"
      h="FREQUENTLY ASKED QUESTIONS"
      sub="Everything You Need to Know"
      desc="Clear, honest answers regarding tattoo pain, hygiene protocols, deposit policies, preparation, and stage-by-stage aftercare."
    >
      {d?.items.length > 0 && (
        <Helmet><script type="application/ld+json">{JSON.stringify(ld)}</script></Helmet>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition ${
              activeCategory === c
                ? 'bg-gold text-[#111] shadow'
                : 'bg-[#18181c] text-muted hover:text-cream border border-line'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <State d={d} err={err}>
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredItems.map(f => (
            <details key={f._id} className="clay p-6 group transition open:border-gold/40">
              <summary className="font-semibold text-cream text-base cursor-pointer list-none flex items-center justify-between gap-4">
                <span>{f.question}</span>
                <span className="text-gold text-lg transition-transform group-open:rotate-45 shrink-0">+</span>
              </summary>
              <div className="mt-4 pt-4 border-t border-line text-sm text-muted leading-relaxed whitespace-pre-line">
                {f.answer}
              </div>
            </details>
          ))}
        </div>
      </State>
    </Wrap>
  );
}

// 9. ABOUT PAGE
export const About = () => {
  const [s, setS] = useState({});
  useEffect(() => {
    api.get('/settings').then(r => setS(r.data)).catch(() => {});
  }, []);

  return (
    <Wrap
      title="About Noor Tattooz"
      h="ILLUMINATING ART ON LIVING SKIN"
      sub="The Noor Atelier Story"
      desc={s.description || "A premier atelier on Una Amb Road, Prem Nagar, Una (H.P.), founded on the principle that tattoos should be bespoke, surgical in hygiene, and timeless in aesthetic value."}
    >
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Narrative Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs text-gold font-semibold uppercase tracking-widest block mb-2">Our Origins</span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Born from Fine Arts and Architectural Precision</h2>
            <p className="text-sm text-muted leading-relaxed mb-4">
              {s.businessName || 'Noor Tattooz Studio'} was founded on the principle that tattoos should be permanent fine art. Located at {s.address || 'Una Amb Road, Near Sabji Mandi, Prem Nagar, Una, Himachal Pradesh'}, our atelier is dedicated to custom narrative tattoos, delicate single-needle precision, and hospital-grade sterility.
            </p>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Every client sits in a private, acoustic-insulated studio bay with personalized lighting, music, and tea service. We dedicate full afternoons to single clients rather than rushing through high turnover.
            </p>
            {s.hours && (
              <p className="text-xs text-gold font-semibold pt-1">
                Studio Hours: {s.hours}
              </p>
            )}
          </div>
          <div className="clay p-3 rounded-2xl overflow-hidden border border-gold/30">
            <img
              src="/tattoos/studio-interior.jpg"
              alt="Noor Tattooz Interior Atmosphere"
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        </div>

      {/* Hygiene Commitment Breakdown */}
      <div className="clay p-8 border border-line">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-gold text-xs tracking-widest uppercase font-semibold">Clinical Protocols</span>
          <h3 className="text-2xl font-bold mt-1">Our Sterility Guarantee</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 grid place-items-center mx-auto mb-3">
              <ShieldCheck size={26} />
            </div>
            <h4 className="font-bold text-sm text-cream mb-1">Single-Use Cartridges</h4>
            <p className="text-xs text-muted">Cheyenne & Kwadron medical-grade needle modules opened directly in front of you.</p>
          </div>
          <div>
            <div className="h-12 w-12 rounded-xl bg-gold/10 text-gold grid place-items-center mx-auto mb-3">
              <Sparkles size={26} />
            </div>
            <h4 className="font-bold text-sm text-cream mb-1">100% Vegan Carbon Inks</h4>
            <p className="text-xs text-muted">Dynamic & Eternal pigments free from animal glycerin, heavy metals, and toxic additives.</p>
          </div>
          <div>
            <div className="h-12 w-12 rounded-xl bg-gold/10 text-gold grid place-items-center mx-auto mb-3">
              <Award size={26} />
            </div>
            <h4 className="font-bold text-sm text-cream mb-1">Bloodborne Certified</h4>
            <p className="text-xs text-muted">Our studio maintains up-to-date WHO and Red Cross hospital-grade pathogen safety credentials.</p>
          </div>
        </div>
      </div>

      {/* Explore Portfolio CTA */}
      <div className="text-center pt-4">
        <h3 className="text-2xl font-bold mb-4">Ready to begin your permanent artwork?</h3>
        <div className="flex justify-center gap-4">
          <Link to="/gallery" className="clay-btn ghost text-xs">
            EXPLORE PORTFOLIO
          </Link>
          <Link to="/booking" className="clay-btn text-xs">
            BOOK A CONSULTATION
          </Link>
        </div>
      </div>
    </div>
  </Wrap>
  );
};

// 10. PRIVACY POLICY
export const Privacy = () => (
  <Wrap
    title="Privacy Policy"
    h="PRIVACY POLICY"
    sub="Your Data & Trust"
    desc="How Noor Tattooz collects, protects, and handles your personal information."
  >
    <div className="max-w-3xl mx-auto clay p-8 space-y-6 text-sm text-muted leading-relaxed">
      <section>
        <h2 className="text-lg font-bold text-cream mb-2">1. Information We Collect</h2>
        <p>When booking a consultation or tattoo appointment, we collect: your full name, contact email address, phone number, design descriptions, and optional reference imagery uploaded through our portal.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-cream mb-2">2. Purpose of Collection</h2>
        <p>We use this information exclusively to communicate regarding your appointment, verify schedule availability, provide medical aftercare guidance, and customize your artwork stencil.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-cream mb-2">3. Zero Third-Party Selling</h2>
        <p>We never sell, rent, or trade your personal data to external advertisers. All contact information is securely stored and accessible solely by our studio management.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-cream mb-2">4. Reference Images & Privacy</h2>
        <p>Uploaded reference images or personal skin photos provided for cover-up consultations remain strictly confidential within our private artist records.</p>
      </section>
    </div>
  </Wrap>
);

// 11. TERMS & CONDITIONS
export const Terms = () => (
  <Wrap
    title="Studio Terms & Policies"
    h="STUDIO POLICIES & TERMS"
    sub="Clear Expectations"
    desc="Please review our studio policies regarding age verification, deposit rules, rescheduling, and aftercare."
  >
    <div className="max-w-3xl mx-auto clay p-8 space-y-6 text-sm text-muted leading-relaxed">
      <section>
        <h2 className="text-lg font-bold text-cream mb-2">1. Strictly 18+ Verification</h2>
        <p>You must be at least 18 years of age on the day of your appointment. Valid government-issued photo identification (Aadhaar, Passport, Driver's License) is required upon arrival. No parental consent exceptions are made.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-cream mb-2">2. Deposits & Illustration Work</h2>
        <p>An appointment deposit (tailored to project scale and design complexity) is required to lock your session date and initiate bespoke illustration drafting. All deposits are fully deducted from your final session payment.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-cream mb-2">3. 48-Hour Rescheduling Window</h2>
        <p>We require at least 48 hours notice prior to your appointment time to reschedule without forfeiting your deposit. Deposits are transferable to a rescheduled date once within 6 months.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-cream mb-2">4. Complimentary 60-Day Touch-Up</h2>
        <p>We provide one complimentary touch-up within 60 days of your original session once your tattoo is fully healed, provided standard aftercare instructions were adhered to.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-cream mb-2">5. Intellectual Property of Custom Artwork</h2>
        <p>All bespoke designs illustrated by our resident artists remain the artistic and intellectual property of Noor Tattooz.</p>
      </section>
    </div>
  </Wrap>
);

// 12. TATTOO STYLES DIRECTORY & DEEP-DIVES
export const STYLES_DETAILS = [
  {
    slug: 'realism',
    name: 'Realism & Portraits',
    tag: 'Realism',
    badge: 'Photographic Depth',
    img: '/tattoos/realism-portrait.jpg',
    lead: 'Hyper-realistic black & grey and color portraiture captured with photographic fidelity and velvety chiaroscuro transitions.',
    description: `Realism at Noor Tattooz transcends standard reproduction; it is the art of capturing soul, light, and dimension on living skin. Mastered by resident artists Kabir Noor and Zara Merchant, our realism pieces utilize multi-stage greywash dilutions paired with soft-edge curved magnums to create seamless gradients without harsh outlines.

Whether immortalizing a loved one, a memory portrait, classical Renaissance sculpture, or wildlife eyes, we balance tonal depth to ensure the tattoo will not darken into a muddy mass over time. Contrast is strategically preserved with negative skin highlights so your piece remains luminous for decades.`,
    specs: {
      needles: '0803 Bugpin Tight Liners, 1015 & 1217 Curved Soft Magnums',
      healingTime: '14 to 21 Days',
      painLevel: 'Mild to Moderate (Soft blending technique minimizes epidermal trauma)',
      bestPlacements: 'Inner Bicep, Outer Forearm, Calf, Shoulder Panel, Full Back'
    },
    technique: [
      'Multi-pass greywash shading calibrated across 4 distinct tone wells',
      'True-to-life light source mapping preserving chiaroscuro highlights',
      'Skin micro-texture rendering with feather-light needle strokes'
    ]
  },
  {
    slug: 'fine-line',
    name: 'Fine Line & Single-Needle',
    tag: 'Fine Line',
    badge: 'Microscopic Precision',
    img: '/tattoos/fineline-botanical.jpg',
    lead: 'Whisper-soft single-needle botanicals, architectural lines, and delicate calligraphy designed for timeless grace.',
    description: `Pioneered by Aanya Sen, fine line tattooing at Noor Tattooz treats skin like handmade cotton rag paper. Using specialized 0301 tight bugpin needles (just 0.25mm in diameter), we deposit medical-grade carbon pigment into the upper dermal layer with surgical restraint.

Unlike heavy traditional lines that spread noticeably over time, our disciplined hand speed, minimal machine voltage, and proper needle angling guarantee that lines heal as crisp, sharp, and delicate as a fountain pen stroke. Perfect for delicate wildflowers, micro-script typography, and minimalist celestial diagrams.`,
    specs: {
      needles: '0301RL & 0501RL Tight Bugpins (0.20mm – 0.25mm)',
      healingTime: '7 to 10 Days (Minimal skin disruption)',
      painLevel: 'Very Low (Gentle, superficial vibration)',
      bestPlacements: 'Collarbone, Inner Wrist, Ribcage, Spine, Behind the Ear, Ankle'
    },
    technique: [
      'Single-needle controlled depth preventing ink blowout or migration',
      'Botanical accuracy drafted directly from live plant references',
      'Feathered micro-shading with zero trauma to surrounding tissue'
    ]
  },
  {
    slug: 'black-and-grey',
    name: 'Black & Grey / Dark Art',
    tag: 'Black & Grey',
    badge: 'Chiaroscuro & Drama',
    img: '/tattoos/blackwork-gothic.jpg',
    lead: 'Atmospheric gothic architecture, rich charcoal washes, and heavy contrasting shadows built for high visual impact.',
    description: `Black & Grey is the bedrock of permanent tattooing. At Noor Tattooz, we combine European dark art traditions with modern precision needle cartridges. We avoid premixed dilute inks, custom-mixing our black washes from pure triple-black vegan pigment on the day of your session.

The result is velvety charcoal shadows, deep saturated blacks that never fade to blue or green, and clean skin highlights that give the design immense three-dimensional weight.`,
    specs: {
      needles: '1007RL Lining, 1211M1 Flat Shading, 1215 Curved Mag',
      healingTime: '10 to 14 Days',
      painLevel: 'Moderate',
      bestPlacements: 'Full Sleeves, Calf & Shin, Chest Panels, Forearm'
    },
    technique: [
      'Custom 4-drop greywash gradation system',
      'Saturated deep black pigment saturation using Dynamic Triple Black',
      'Structural anatomical framing ensuring lines move naturally with muscle groups'
    ]
  },
  {
    slug: 'japanese',
    name: 'Modern Japanese Irezumi',
    tag: 'Japanese',
    badge: 'Mythological Mastery',
    img: '/tattoos/japanese-dragon.jpg',
    lead: 'Mythological Ryu dragons, swimming koi, wind bars, and ceremonial peonies engineered for grand bodily canvas.',
    description: `Headed by Vikram "Vex" Malhotra, our Japanese Irezumi work respects the ancient rules of Horimono while embracing clean contemporary line dynamics. Japanese tattoos are composed as full stories that flow with the body—dragons ascending toward the shoulder, koi swimming against the natural river current of the arm, and clouds (Kumo) framing sacred blossoms.

We ensure that every element is culturally coherent and placed according to traditional seasonal symbolism.`,
    specs: {
      needles: '1209RL & 1211RL Bold Liners, 1223 Magnum for heavy wind bars',
      healingTime: '14 to 20 Days',
      painLevel: 'Moderate to High (Extensive background coverage)',
      bestPlacements: 'Full Sleeves, 7/10 Sleeves, Torso Panels, Full Back'
    },
    technique: [
      'Traditional wind bar (Kaze) and background water flow structuring',
      'High-saturation sumi black tones contrasted with vivid negative space',
      'Mythological storytelling and authentic Horimono composition'
    ]
  },
  {
    slug: 'minimalist',
    name: 'Minimalist & Lettering',
    tag: 'Minimalist',
    badge: 'Understated Elegance',
    img: '/tattoos/minimalist-script.jpg',
    lead: 'Micro-script, personal mantras, coordinates, and subtle geometric silhouettes stripped of all excess noise.',
    description: `Minimalism requires absolute perfection; when there are only four lines in a tattoo, every millimeter must be immaculate. Our artists use digital typography tools to customize letter kerning, baseline curvature, and micro-spacing to ensure legibility throughout a lifetime.

We specialize in bespoke script handwriting replicas, meaningful coordinates, subtle date markers, and astrological silhouettes that speak through understated elegance.`,
    specs: {
      needles: '0301RL Single Needle, 0503RL Round Liner',
      healingTime: '5 to 7 Days',
      painLevel: 'Low',
      bestPlacements: 'Wrist, Ankle, Ribs, Collarbone, Behind Arm'
    },
    technique: [
      'Custom typography kerning and letter spacing',
      'Micro-needle placement that never spreads into adjacent skin',
      'Personal handwriting vectorization from family letters or notes'
    ]
  },
  {
    slug: 'geometric',
    name: 'Sacred Geometry & Mandalas',
    tag: 'Geometric',
    badge: 'Fibonacci & Symmetry',
    img: '/tattoos/geometric-sleeve.jpg',
    lead: 'Anatomical mandalas, stippled dotwork gradations, and mathematical ratios aligned to bodily symmetry.',
    description: `Sacred geometry explores the fundamental mathematical patterns of the cosmos: the golden ratio, the seed of life, Sri Yantra, and Platonic solids. Kabir Noor maps each geometric lattice directly onto the client's limb or torso, calculating distortion so that circles remain true circles when you rotate your arm or flex your muscles.

Every shadow is built through individual micro-dots (stippling), creating a mesmerizing sand-mandala texture that ages with magnificent clarity.`,
    specs: {
      needles: '0803RL Stippling Liner, 1005RL Structural Liner',
      healingTime: '10 to 14 Days',
      painLevel: 'Mild (Dotwork creates significantly less irritation than solid packing)',
      bestPlacements: 'Forearm Sleeves, Upper Back, Elbow, Knee, Chest Center'
    },
    technique: [
      'Mathematical compass & grid mapping calculated for 3D skin curvature',
      'Stippled dotwork shading creating soft acoustic gradients',
      'Harmonic resonance and sacred symbol accuracy'
    ]
  },
  {
    slug: 'neo-traditional',
    name: 'Neo-Traditional & Ornamental',
    tag: 'Neo-Traditional',
    badge: 'Rich Linework & Motifs',
    img: '/tattoos/neotrad-dagger.jpg',
    lead: 'Dynamic line weight hierarchy, antique daggers, gilded flora, and ornamental heraldry built to withstand the test of time.',
    description: `Neo-Traditional merges the bold, bulletproof readability of traditional American and European tattooing with intricate modern fine art detailing. Characterized by strong bold outer outlines, delicate internal hatching, and luxurious antique ornamentation, this style looks striking from across the room while revealing intricate subtleties up close.`,
    specs: {
      needles: '1209RL Outer Border, 0805RL Fine Internal Hatching, 1215 Curved Mag',
      healingTime: '12 to 16 Days',
      painLevel: 'Moderate',
      bestPlacements: 'Thigh, Outer Bicep, Forearm, Shin, Calves'
    },
    technique: [
      'Dynamic line weight variation creating dramatic depth',
      'Art Nouveau and Victorian ornamentation influences',
      'Deep contrast saturation ensuring readability for decades'
    ]
  },
  {
    slug: 'custom-designs',
    name: 'Custom Concepts & Cover-Ups',
    tag: 'Custom Designs',
    badge: 'Transformative Art',
    img: '/tattoos/tattoo-craft.jpg',
    lead: 'Transformative cover-ups, medical scar camouflaging, and bespoke multidisciplinary concepts engineered exclusively for your story.',
    description: `No two lives are alike, and no two tattoos at Noor Tattooz are duplicated. If you have an abstract idea that crosses multiple styles—or an unwanted old tattoo or surgical scar that needs reimagining—our master artists engineer bespoke compositions.

We work with your existing skin texture and coloration, turning imperfections into features and creating transformative art that restores confidence and pride.`,
    specs: {
      needles: 'Multidisciplinary custom setup',
      healingTime: '14 to 21 Days',
      painLevel: 'Varies by placement and scar tissue maturation',
      bestPlacements: 'Any body zone requiring transformation or custom storytelling'
    },
    technique: [
      'Strategic dark-to-light camouflage matrix without muddy accumulation',
      'Scar tissue evaluation ensuring gentle epidermal penetration',
      '100% original bespoke illustration created in collaboration with client'
    ]
  }
];

// Styles Directory Page
export function Styles() {
  const [s, setS] = useState({});
  useEffect(() => { api.get('/settings').then(r => setS(r.data)).catch(() => {}); }, []);

  return (
    <Wrap
      title="Tattoo Styles & Art Disciplines"
      h="TATTOO STYLES & DISCIPLINES"
      sub="Aesthetic Mastery"
      desc="Explore the distinct visual languages, technical needle configurations, and artistic traditions practiced by our resident masters in Una, Himachal Pradesh."
    >
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {STYLES_DETAILS.map(style => (
          <article key={style.slug} className="clay p-6 flex flex-col justify-between group hover:-translate-y-1 transition duration-300 border border-line hover:border-gold/50">
            <div>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-5 bg-[#0a2016]">
                <img
                  src={style.img}
                  alt={style.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#030d08]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-gold border border-gold/40">
                  {style.badge}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-cream group-hover:text-gold transition mb-2">
                {style.name}
              </h2>
              <p className="text-sm text-silver font-medium mb-3">
                {style.lead}
              </p>
              <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-5">
                {style.description}
              </p>

              <div className="p-3.5 rounded-lg bg-[#05150f] border border-[#143024] text-xs space-y-1.5 mb-5">
                <div className="flex justify-between">
                  <span className="text-muted">Needle Profile:</span>
                  <span className="text-cream font-medium truncate max-w-[200px]">{style.specs.needles.split(',')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Healing Time:</span>
                  <span className="text-gold font-medium">{style.specs.healingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Recommended Placements:</span>
                  <span className="text-silver truncate max-w-[200px]">{style.specs.bestPlacements.split(',')[0]}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
              <Link to={`/styles/${style.slug}`} className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold">
                Explore In-Depth Guide <ChevronRight size={14} />
              </Link>
              <div className="flex items-center gap-2">
                {s.whatsapp && (
                  <a
                    href={waLink(s.whatsapp, `Hello Noor Tattooz, I am interested in discussing a ${style.name} tattoo.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay-btn ghost !py-1.5 !px-3 !text-xs flex items-center gap-1"
                  >
                    <MessageCircle size={13} className="text-emerald-400" /> WhatsApp
                  </a>
                )}
                <Link to={`/booking?style=${encodeURIComponent(style.name)}`} className="clay-btn !py-1.5 !px-3 !text-xs">
                  BOOK STYLE
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="clay p-8 text-center max-w-3xl mx-auto border border-gold/30">
        <h3 className="text-2xl font-bold mb-3">Unsure which discipline fits your concept?</h3>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          Book a complimentary 1-on-1 consultation at our Una atelier. We will review your ideas, test stencil placements, and recommend the ideal technique for your anatomy.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/booking" className="clay-btn text-xs">
            BOOK 1-ON-1 CONSULTATION
          </Link>
          <Link to="/gallery" className="clay-btn ghost text-xs">
            VIEW FULL GALLERY
          </Link>
        </div>
      </div>
    </Wrap>
  );
}

// Single Style Page
export function StylePage() {
  const { style: paramStyle } = useParams();
  const [works, setWorks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [s, setS] = useState({});

  const info = STYLES_DETAILS.find(item => item.slug === paramStyle || item.tag.toLowerCase() === (paramStyle || '').toLowerCase()) || STYLES_DETAILS[0];

  useEffect(() => {
    api.get('/settings').then(r => setS(r.data)).catch(() => {});
    api.get('/gallery', { params: { style: info.tag, limit: 9 } }).then(r => setWorks(r.data.items || [])).catch(() => {});
    api.get('/artists?limit=10').then(r => {
      const matched = (r.data.items || []).filter(a => a.styles?.some(st => st.toLowerCase().includes(info.tag.toLowerCase()) || info.tag.toLowerCase().includes(st.toLowerCase())));
      setArtists(matched.length ? matched : (r.data.items || []).slice(0, 2));
    }).catch(() => {});
  }, [info]);

  return (
    <Wrap
      title={`${info.name} Tattoos Una (H.P.)`}
      h={info.name.toUpperCase()}
      sub="Master Style Guide"
      desc={info.lead}
    >
      <div className="grid lg:grid-cols-12 gap-10 items-start mb-16">
        <div className="lg:col-span-5">
          <div className="clay p-3 rounded-2xl overflow-hidden border border-gold/40 shadow-2xl">
            <img src={info.img} alt={info.name} className="w-full h-auto rounded-xl object-cover aspect-[4/3]" />
          </div>

          <div className="clay p-6 mt-6 border border-line">
            <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-4">Technical Specifications</h4>
            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-cream block">Needle Groupings:</strong>
                <span className="text-muted">{info.specs.needles}</span>
              </div>
              <div>
                <strong className="text-cream block">Healing Timeline:</strong>
                <span className="text-emerald-400">{info.specs.healingTime}</span>
              </div>
              <div>
                <strong className="text-cream block">Pain Sensation Profile:</strong>
                <span className="text-silver">{info.specs.painLevel}</span>
              </div>
              <div>
                <strong className="text-cream block">Recommended Placements:</strong>
                <span className="text-muted">{info.specs.bestPlacements}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 clay p-8 border border-line">
          <span className="text-xs font-semibold text-gold tracking-widest uppercase block mb-2">{info.badge}</span>
          <h2 className="text-3xl font-bold mb-4">{info.name} at Noor Tattooz</h2>
          <div className="text-sm text-silver/90 leading-relaxed whitespace-pre-line mb-8">
            {info.description}
          </div>

          <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-3">Core Technical Tenets</h4>
          <ul className="space-y-2.5 mb-8">
            {info.technique.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-muted">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-line flex flex-wrap items-center gap-4">
            <Link to={`/booking?style=${encodeURIComponent(info.name)}`} className="clay-btn">
              BOOK A {info.tag.toUpperCase()} SESSION
            </Link>
            {s.whatsapp && (
              <a
                href={waLink(s.whatsapp, `Hello Noor Tattooz! I would like to consult with an artist regarding a ${info.name} design.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn ghost text-xs flex items-center gap-2"
              >
                <MessageCircle size={16} className="text-emerald-400" />
                <span>DISCUSS ON WHATSAPP</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Resident Artists specializing in this style */}
      {artists.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="text-gold text-xs tracking-widest uppercase font-semibold">Specialist Masters</span>
            <h3 className="text-2xl font-bold mt-1">Resident Artists Specializing in {info.name}</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {artists.map(a => (
              <div key={a._id} className="clay p-5 flex items-center gap-4 group">
                <img src={img(a.image)} alt={a.name} className="h-20 w-20 rounded-xl object-cover shrink-0 border border-gold/30" />
                <div>
                  <h4 className="font-bold text-cream group-hover:text-gold transition">{a.name}</h4>
                  <span className="text-xs text-gold font-medium">{a.experience} Years Mastery</span>
                  <p className="text-[11px] text-muted line-clamp-2 mt-1">{a.bio}</p>
                  <Link to={`/artists/${a.slug}`} className="text-[11px] text-gold hover:underline mt-2 inline-block font-semibold">
                    View Portfolio ›
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Relevant Gallery Pieces */}
      {works.length > 0 && (
        <section>
          <div className="text-center mb-8">
            <span className="text-gold text-xs tracking-widest uppercase font-semibold">Living Portfolio</span>
            <h3 className="text-2xl font-bold mt-1">Recent {info.name} Works</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map(piece => (
              <Link key={piece._id} to={`/gallery/${piece.slug}`} className="clay overflow-hidden group block">
                <div className="aspect-square bg-[#0b1c15] overflow-hidden">
                  <img src={img(piece.image)} alt={piece.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-cream group-hover:text-gold transition">{piece.title}</h4>
                  <span className="text-xs text-muted block mt-1">{piece.placement || piece.style}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Wrap>
  );
}

// 13. TATTOO PROCESS PAGE
export function Process() {
  const [s, setS] = useState({});
  useEffect(() => { api.get('/settings').then(r => setS(r.data)).catch(() => {}); }, []);

  const steps = [
    {
      num: '01',
      title: 'Initial Consultation & Concept Exploration',
      lead: 'Meet in our private Una studio lounge over artisanal refreshments with zero sales pressure.',
      details: [
        'Detailed listening session to understand your personal narrative, symbolism, and aesthetic preferences',
        'Physical inspection of your target placement area, skin tone, and body curvature',
        'Evaluation of reference images, isolating elements that resonate while identifying what to avoid',
        'Transparent quote calculation covering size, complexity, and session duration with zero hidden extras'
      ]
    },
    {
      num: '02',
      title: 'Design Discussion & Artistic Direction',
      lead: 'Collaborate with your resident master on visual balance, flow, and contrast.',
      details: [
        'Anatomical mapping: designing the piece to follow natural muscle contours so it moves organically',
        'Scale planning: selecting needle line weights that will remain crisp and legible after decades of aging',
        'Integration review: harmonizing the new concept with your existing tattoos or scar tissue'
      ]
    },
    {
      num: '03',
      title: 'Bespoke Illustration & Stencil Preparation',
      lead: 'Your artist illustrates a 100% original piece tailored exclusively to your canvas.',
      details: [
        'Zero copied stencils or generic catalog flash; every single line is custom illustrated',
        'Digital 3D mockup presented on your skin photograph 48 hours prior to the session for review',
        'Precision thermal stencil printed and checked against anatomical reference points'
      ]
    },
    {
      num: '04',
      title: 'Appointment Day & Client Preparation',
      lead: 'Step into a calm, welcoming sanctuary designed for psychological and physical comfort.',
      details: [
        'Pre-session check: ensure 8+ hours of sleep, complete 24-hour abstinence from alcohol and blood thinners',
        'Pre-tattoo meal: eat a solid protein and complex carbohydrate meal 1 to 2 hours prior to stabilize blood sugar',
        'Comfort setup: private, sound-insulated bay, personalized music or film selection, and ergonomic clinical bed'
      ]
    },
    {
      num: '05',
      title: 'The Gentle Sterile Tattoo Session',
      lead: 'Experience surgical-grade sterility and artist-led pacing focused on minimal tissue trauma.',
      details: [
        'Single-use Cheyenne Safety & Kwadron needle blister packs opened directly in front of you',
        'Thermal stencil applied and evaluated in three-way mirrors until placement is absolutely flawless',
        'High-precision execution with constant skin soothing, gentle wipes, and breaks tailored to your endurance'
      ]
    },
    {
      num: '06',
      title: 'Medical Shield Application & Aftercare Guidance',
      lead: 'Seal your artwork with hospital-grade dermal protection and receive dedicated aftercare support.',
      details: [
        'Application of breathable, waterproof Saniderm / SecondSkin dermal shield for optimal moist healing',
        'Complimentary aftercare kit including organic vegan aftercare balm and step-by-step instructions',
        'Direct WhatsApp concierge access for daily healing check-ins and our 60-day complimentary touch-up guarantee'
      ]
    }
  ];

  return (
    <Wrap
      title="The Noor Tattoo Process"
      h="OUR 6-STAGE ARTISTIC PROCESS"
      sub="From Conception to Living Skin"
      desc="A transparent, meticulous, and respectful journey ensuring your permanent artwork is crafted with utmost artistic integrity and clinical safety."
    >
      <div className="max-w-4xl mx-auto space-y-8 mb-16">
        {steps.map(step => (
          <div key={step.num} className="clay p-6 sm:p-8 relative border border-line hover:border-gold/40 transition">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <span className="font-display text-4xl sm:text-5xl font-bold text-gold/40">
                  {step.num}
                </span>
                <div>
                  <span className="text-[11px] text-gold tracking-widest uppercase font-semibold">Stage {step.num}</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-cream">{step.title}</h3>
                </div>
              </div>
            </div>

            <p className="text-sm text-silver font-medium mb-4 pl-0 sm:pl-16">
              {step.lead}
            </p>

            <ul className="space-y-2 pl-0 sm:pl-16">
              {step.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Session Day Preparation Box */}
      <section className="clay p-8 max-w-4xl mx-auto mb-16 border border-emerald-500/30 bg-[#04140e]">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/20 text-emerald-400 grid place-items-center">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-cream">Appointment Day Checklist</h3>
            <p className="text-xs text-muted">What to do before arriving at our Una atelier</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs text-muted">
          <div className="p-3.5 rounded-lg bg-[#061b13] border border-[#143d2c]">
            <strong className="text-cream block mb-1">✓ Hydration & Rest</strong>
            Drink plenty of water the preceding 48 hours and sleep at least 7–8 hours the night before.
          </div>
          <div className="p-3.5 rounded-lg bg-[#061b13] border border-[#143d2c]">
            <strong className="text-cream block mb-1">✓ Eat a Solid Meal</strong>
            Have a balanced meal 1–2 hours before your appointment to maintain blood glucose and reduce pain sensitivity.
          </div>
          <div className="p-3.5 rounded-lg bg-[#061b13] border border-[#143d2c]">
            <strong className="text-cream block mb-1">✗ Zero Alcohol or Aspirin</strong>
            Avoid alcohol, blood thinners, and excessive caffeine for 24 hours prior to prevent bleeding.
          </div>
          <div className="p-3.5 rounded-lg bg-[#061b13] border border-[#143d2c]">
            <strong className="text-cream block mb-1">✓ Loose Comfortable Clothing</strong>
            Wear loose, dark, non-restrictive garments granting clean, easy access to your tattoo placement area.
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-3">Ready to begin Stage 01?</h3>
        <p className="text-sm text-muted max-w-md mx-auto mb-6">
          Schedule your complimentary consultation or message our concierge on WhatsApp.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link to="/booking" className="clay-btn">
            BOOK A CONSULTATION
          </Link>
          {s.whatsapp && (
            <a
              href={waLink(s.whatsapp, 'Hello Noor Tattooz, I would like to book a consultation to begin the tattoo process.')}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn ghost flex items-center gap-2"
            >
              <MessageCircle size={16} className="text-emerald-400" />
              <span>CONSULT ON WHATSAPP</span>
            </a>
          )}
        </div>
      </div>
    </Wrap>
  );
}

// 14. HYGIENE & SAFETY PAGE
export function Hygiene() {
  const [s, setS] = useState({});
  useEffect(() => { api.get('/settings').then(r => setS(r.data)).catch(() => {}); }, []);

  const standards = [
    {
      title: '100% Single-Use Needle Cartridges',
      desc: 'We utilize exclusively Cheyenne Safety and Kwadron medical cartridges. Every blister pack is factory-sealed, EO-gas sterilized with verified LOT numbers, unsealed in your full view, and immediately deposited in puncture-proof sharps biohazard containers upon completion. Needles are NEVER reused or re-sterilized.',
      badge: 'Sterile Blister Packs'
    },
    {
      title: 'Hospital-Grade Surface Disinfection',
      desc: 'Workstations, hydraulic client beds, armrests, tray stands, and lighting arms are treated with Cavicide and intermediate hospital-grade tuberculocidal disinfectant sprays before and after every single client, following strict 5-minute kill-time protocols.',
      badge: 'Cavicide Protocol'
    },
    {
      title: 'Total Equipment Barrier Protection',
      desc: 'Any surface touched by artist hands during tattooing is wrapped in disposable medical barrier film: machine covers, clip cord sleeves, grip wraps, and wash bottle plastic bags are replaced entirely between clients.',
      badge: 'Cross-Contamination Barrier'
    },
    {
      title: 'Medical Nitrile Gloves & Hand Asepsis',
      desc: 'Our artists wear medical-grade, powder-free, latex-free nitrile examination gloves. Gloves are changed frequently throughout the session—any time an artist leaves the operatory or touches a non-barrier surface.',
      badge: 'Medical Examination Nitrile'
    },
    {
      title: '100% Vegan Carbon Pigments',
      desc: 'We exclusively stock premium inks from Dynamic Color and Eternal Ink. Our pigments are certified 100% vegan, cruelty-free, free of animal glycerin, bone char, and heavy metal contaminants (such as nickel, lead, and cadmium).',
      badge: 'Heavy-Metal Free'
    },
    {
      title: 'Class-B Vacuum Autoclave & Spore Testing',
      desc: 'All non-disposable stainless steel instruments undergo multi-stage ultrasonic cleaning and vacuum autoclave sterilization, monitored with third-party biological spore test indicators.',
      badge: 'Biological Spore Tested'
    },
    {
      title: 'Certified Biomedical Sharps Disposal',
      desc: 'All contaminated needles and sharps are sealed in rigid, puncture-proof biohazard containers and collected by licensed biomedical waste management services under strict environmental guidelines.',
      badge: 'Biomedical Waste Compliant'
    },
    {
      title: 'Private Climate-Controlled Operatory Suites',
      desc: 'Unlike loud open-floor walk-in shops, our Una studio features private, acoustic-insulated bays equipped with medical HEPA air purification systems to eliminate airborne contaminants.',
      badge: 'HEPA Air Purified'
    }
  ];

  return (
    <Wrap
      title="Hygiene & Safety Standards"
      h="CLINICAL HYGIENE & STERILITY"
      sub="Zero Compromise Safety"
      desc="Your health is our sacred responsibility. At Noor Tattooz, we adhere to hospital-grade sterilization and cross-contamination protocols."
    >
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
        {standards.map((st, i) => (
          <div key={i} className="clay p-6 border border-line flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {st.badge}
                </span>
                <ShieldCheck size={18} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-cream mb-2">{st.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Honest Commitment Statement */}
      <div className="clay p-8 max-w-3xl mx-auto text-center border border-gold/40 mb-12">
        <Award size={32} className="text-gold mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-2">Our Safety Promise to You</h3>
        <p className="text-xs text-muted leading-relaxed mb-6">
          We believe in honest, certified craftsmanship. Every resident artist maintains active certification in Bloodborne Pathogens and Infection Control (OSHA 29 CFR 1910.1030 standards). If you ever want to inspect our sterilization logs or watch your needle pack unsealed, our team is proud to guide you through our protocols.
        </p>
        {s.whatsapp && (
          <a
            href={waLink(s.whatsapp, 'Hello Noor Tattooz, I have a hygiene or safety question before booking.')}
            target="_blank"
            rel="noopener noreferrer"
            className="clay-btn ghost text-xs inline-flex items-center gap-2"
          >
            <MessageCircle size={15} className="text-emerald-400" />
            <span>ASK A HYGIENE QUESTION ON WHATSAPP</span>
          </a>
        )}
      </div>
    </Wrap>
  );
}

// 15. AFTERCARE PAGE
export function Aftercare() {
  const [s, setS] = useState({});
  useEffect(() => { api.get('/settings').then(r => setS(r.data)).catch(() => {}); }, []);

  const stages = [
    {
      phase: 'Phase 1: Days 1 to 4',
      title: 'The Dermal Shield (Saniderm / SecondSkin)',
      instructions: [
        'Keep the breathable medical shield on for 3 to 4 days continuously.',
        'A fluid buildup of plasma, lymph, and excess ink inside the bandage is completely normal (often called an "ink sack"). This fluid contains nourishing enzymes that accelerate wound closure.',
        'The shield is waterproof; you may take short showers, but avoid aiming high-pressure hot water directly at the film.',
        'To remove: peel slowly downwards along the grain of the skin under running lukewarm water in the shower. Do NOT rip it off quickly like a band-aid.'
      ]
    },
    {
      phase: 'Phase 2: Days 5 to 14',
      title: 'Gentle Washing & Breathable Hydration',
      instructions: [
        'Wash 2 to 3 times daily using lukewarm water and a fragrance-free antibacterial liquid soap (e.g., Cetaphil or mild baby wash) with clean hands only.',
        'Never use a sponge, washcloth, or loofah; clean fingertips only.',
        'Pat gently dry with clean single-use paper towels. Never rub with a bath towel, which harbors bacteria.',
        'Apply a micro-thin layer of unscented tattoo balm (Hustle Butter or Aquaphor). The skin should look matte, not glossy or suffocated with heavy ointment.'
      ]
    },
    {
      phase: 'Phase 3: Days 15 to 30',
      title: 'Peeling, Flaking & The "Silver Skin" Stage',
      instructions: [
        'Your tattoo will begin to naturally shed fine, colored flakes similar to a mild sunburn. This is healthy epidermal regeneration.',
        'CRITICAL: NEVER scratch, pick, or peel the flaking skin. Pulling off flakes prematurely will pull ink out of the dermis, causing patchy spots.',
        'If it itches, gently pat the area or apply a cold compress over clean clothing.',
        'Transition from ointment to an unscented daily body lotion (e.g., Aveeno Daily Moisturizing or Lubriderm).'
      ]
    },
    {
      phase: 'Phase 4: Day 30 and Beyond',
      title: 'Lifelong Preservation & Sun Protection',
      instructions: [
        'Once the skin is fully smooth and matte, your tattoo is settled in the dermis.',
        'Ultraviolet (UV) radiation is the primary cause of ink fading and line diffusion over time.',
        'Apply Broad Spectrum SPF 50+ sunscreen over your healed tattoo whenever spending time in sunlight.',
        'Stay hydrated and moisturize your skin regularly to maintain high visual contrast.'
      ]
    }
  ];

  return (
    <Wrap
      title="Tattoo Aftercare Guide"
      h="COMPLETE TATTOO AFTERCARE"
      sub="Protecting Your Investment"
      desc="The longevity and vibrancy of your tattoo depends on proper healing. Follow our stage-by-stage guide for pristine results."
    >
      <div className="max-w-4xl mx-auto space-y-8 mb-16">
        {stages.map((st, i) => (
          <div key={i} className="clay p-6 sm:p-8 border border-line">
            <span className="text-xs font-semibold text-gold tracking-widest uppercase block mb-1">
              {st.phase}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-cream mb-4">{st.title}</h3>
            <ul className="space-y-2.5">
              {st.instructions.map((ins, j) => (
                <li key={j} className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{ins}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* What to Avoid Grid */}
      <section className="clay p-8 max-w-4xl mx-auto mb-16 border border-red-500/30 bg-[#14080a]">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-red-500/20 text-red-400 grid place-items-center">
            <AlertCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-cream">Strictly Avoid During First 3 Weeks</h3>
            <p className="text-xs text-muted">Activities that will damage your healing artwork</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#1f0c0f] border border-[#3b171d] text-muted">
            <strong className="text-red-300 block mb-1">✗ No Submerging in Water</strong>
            No swimming pools, oceans, lakes, bathtubs, or jacuzzis. Prolonged soaking introduces bacteria and leaches pigment.
          </div>
          <div className="p-3.5 rounded-lg bg-[#1f0c0f] border border-[#3b171d] text-muted">
            <strong className="text-red-300 block mb-1">✗ No Direct Sunlight or Tanning</strong>
            Direct UV exposure on an unhealed wound will cause severe burning, hyperpigmentation, and ink breakdown.
          </div>
          <div className="p-3.5 rounded-lg bg-[#1f0c0f] border border-[#3b171d] text-muted">
            <strong className="text-red-300 block mb-1">✗ No Heavy Sweat or Gym Friction</strong>
            Avoid intense cardio or weight training that rubs against the tattoo for at least 72 hours.
          </div>
          <div className="p-3.5 rounded-lg bg-[#1f0c0f] border border-[#3b171d] text-muted">
            <strong className="text-red-300 block mb-1">✗ No Vaseline or Heavy Petroleum</strong>
            Petroleum jelly blocks air circulation, trapping heat and bacteria, which can cause micro-infections.
          </div>
        </div>
      </section>

      {/* When to Contact Us & Touch-up Guarantee */}
      <section className="clay p-8 max-w-4xl mx-auto border border-gold/40 text-center">
        <h3 className="text-2xl font-bold mb-2">60-Day Complimentary Touch-Up Policy</h3>
        <p className="text-xs text-muted max-w-2xl mx-auto leading-relaxed mb-6">
          Every custom piece at Noor Tattooz comes with one free touch-up session within 60 days of your original appointment once fully healed. If you notice any area where ink settled lightly or needs refinement, we touch it up at zero cost.
        </p>

        {s.whatsapp && (
          <div className="inline-block p-4 rounded-xl bg-[#061b13] border border-[#173e2e]">
            <span className="text-xs text-gold uppercase tracking-widest font-bold block mb-1">Aftercare Hotline</span>
            <p className="text-xs text-muted mb-3">Send photos of your healing tattoo anytime for artist evaluation.</p>
            <a
              href={waLink(s.whatsapp, 'Hello Noor Tattooz, I have an aftercare question regarding my healing tattoo.')}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn !py-2 !px-5 text-xs inline-flex items-center gap-2"
            >
              <MessageCircle size={16} />
              <span>MESSAGE AFTERCARE CONCIERGE ON WHATSAPP</span>
            </a>
          </div>
        )}
      </section>
    </Wrap>
  );
}
