import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles,
  Feather,
  ArrowRight,
  MessageCircle,
  X,
  ChevronRight,
  RefreshCw,
  Search,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { api, img, waLink } from '../api.js';
import { SEO } from '../App.jsx';
import { isOwnerWork } from '../utils/ownerWorks.js';

const STYLES = [
  'All',
  'Realism',
  'Fine Line',
  'Black & Grey',
  'Sacred Geometry',
  'Custom Sleeve',
  'Portrait',
  'Japanese',
  'Cover-Up',
  'Mandala'
];

export default function OwnerWorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const loadOwnerWorks = () => {
    setLoading(true);
    setErr(false);
    api
      .get('/gallery?limit=100')
      .then(r => {
        const allItems = r.data.items || [];
        const ownerOnly = allItems.filter(isOwnerWork);
        setWorks(ownerOnly);
      })
      .catch(() => setErr(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOwnerWorks();
  }, []);

  useEffect(() => {
    const esc = e => e.key === 'Escape' && setActiveModal(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const filteredWorks = works.filter(w => {
    const matchesStyle = selectedStyle === 'All' || (w.style || '').toLowerCase() === selectedStyle.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      (w.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.placement || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStyle && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <SEO
        title="Owner's Tattoo Artworks | Handcrafted by Noor"
        description="Exclusive gallery of tattoo artworks handcrafted by Noor, founder & lead master tattoo artist of Noor Tattooz Studio Una. Uploaded directly by the studio admin."
      />

      {/* Hero Section */}
      <div className="mb-14 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 text-gold border border-gold/40 text-xs font-bold uppercase tracking-widest shadow-sm">
          <Sparkles size={14} className="text-gold" />
          <span>Exclusive Studio Owner's Showcase · Uploaded by Admin</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-cream">
          ARTWORKS BY OWNER NOOR
        </h1>

        <p className="text-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Every piece in this dedicated section is handcrafted personally by studio owner & master artist <strong className="text-silver">Noor</strong> at our Prem Nagar atelier in Una (H.P.). Browse recent client sleeves, dark realism portraits, and spiritual ink uploaded directly from the studio.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/booking" className="clay-btn text-xs !py-2.5 !px-5 inline-flex items-center gap-2">
            <CalendarCheck size={14} />
            <span>BOOK A SESSION WITH NOOR</span>
          </Link>
          <a
            href={waLink(
              settings.whatsapp || '8219811181',
              'Hi Noor, I am looking at your personal artworks on the website and would like to consult on a custom tattoo session.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#144230] hover:bg-[#1c5d43] text-[#55f2a3] border border-[#23704f] transition shadow-md"
          >
            <MessageCircle size={14} />
            <span>WHATSAPP NOOR DIRECTLY</span>
          </a>
        </div>
      </div>

      {/* Search & Style Filter Bar */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-4 border border-gold/20">
        {/* Style Buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {STYLES.map(s => (
            <button
              key={s}
              onClick={() => setSelectedStyle(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition ${
                selectedStyle === s
                  ? 'bg-gold text-[#04120b] font-bold shadow-md scale-105'
                  : 'bg-[#04140e] text-muted hover:text-cream border border-[#143526]'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Noor's work..."
            className="field !pl-9 w-full text-xs"
            aria-label="Search owner artworks"
          />
        </div>
      </div>

      {/* Grid of Owner Works */}
      {err ? (
        <div className="text-center py-16 clay p-6 max-w-md mx-auto space-y-3">
          <p className="text-muted text-sm">Unable to load owner artworks right now.</p>
          <button onClick={loadOwnerWorks} className="clay-btn ghost text-xs inline-flex items-center gap-2">
            <RefreshCw size={13} />
            <span>TRY AGAIN</span>
          </button>
        </div>
      ) : loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card h-80 animate-pulse border border-gold/15" />
          ))}
        </div>
      ) : !filteredWorks.length ? (
        <div className="glass-card p-12 text-center border border-gold/25 max-w-xl mx-auto space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-gold/15 text-gold border border-gold/30 grid place-items-center mx-auto">
            <Feather size={28} />
          </div>
          <h3 className="text-xl font-bold text-cream font-display">
            {searchTerm || selectedStyle !== 'All' ? 'No matching pieces found' : "Owner's Collection in Progress"}
          </h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {searchTerm || selectedStyle !== 'All'
              ? 'Try resetting your search filter or selecting "ALL" styles.'
              : 'Studio owner Noor is actively tattooing in the atelier. Photos uploaded via the Admin Panel will appear here immediately.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {(searchTerm || selectedStyle !== 'All') && (
              <button
                onClick={() => {
                  setSelectedStyle('All');
                  setSearchTerm('');
                }}
                className="clay-btn ghost text-xs"
              >
                RESET FILTERS
              </button>
            )}
            <Link to="/booking" className="clay-btn text-xs">
              BOOK A SESSION WITH NOOR
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map(piece => {
            const whatsappMsg = `Hi Noor, I saw your artwork "${piece.title}" on the website and would like to consult on a custom session with you.`;
            return (
              <article
                key={piece._id}
                onClick={() => setActiveModal(piece)}
                className="glass-card p-4 border border-gold/30 hover:border-gold/70 transition-all cursor-pointer flex flex-col justify-between group overflow-hidden shadow-xl"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#05160e] mb-4">
                    <img
                      src={img(piece.image)}
                      alt={piece.imageAlt || piece.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="bg-[#030e08]/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-bold text-gold border border-gold/40">
                        {piece.style || 'Custom Art'}
                      </span>
                      {piece.placement && (
                        <span className="bg-[#04120b]/85 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-medium text-silver border border-[#143526]">
                          {piece.placement}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-gold text-[#03110b] px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Sparkles size={10} />
                      <span>By Owner Noor</span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-cream group-hover:text-gold transition line-clamp-1">
                    {piece.title}
                  </h2>
                  <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
                    <Feather size={12} className="text-gold" />
                    <span>Artisan: <strong className="text-silver">Noor (Studio Founder)</strong></span>
                  </p>
                  {piece.description && (
                    <p className="text-xs text-muted/80 mt-2 line-clamp-2 leading-relaxed">
                      {piece.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#143526] flex items-center justify-between text-xs">
                  <a
                    href={waLink(settings.whatsapp || '8219811181', whatsappMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Consult with Noor</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <span className="text-muted group-hover:text-cream text-[11px] font-medium transition flex items-center gap-0.5">
                    <span>View Specs</span>
                    <ChevronRight size={13} />
                  </span>
                </div>
              </article>
            );
          })}
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
            className="glass-card p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gold/50 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gold font-semibold uppercase tracking-wider">{activeModal.style}</span>
                  {activeModal.placement && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#17171e] text-silver border border-[#143526]">
                      {activeModal.placement}
                    </span>
                  )}
                  <span className="bg-gold text-[#03110b] font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider flex items-center gap-1 shadow">
                    <Sparkles size={10} />
                    <span>Founder Noor Original</span>
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-cream font-display mt-0.5">{activeModal.title}</h2>
                <p className="text-xs text-muted mt-1">
                  Artisan: <strong className="text-cream">Noor (Studio Owner & Lead Master Tattoo Artist)</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-muted hover:text-cream rounded-full bg-[#18181c] border border-line"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden mb-6 bg-[#081710] border border-gold/20">
              <img
                src={img(activeModal.image)}
                alt={activeModal.imageAlt || activeModal.title}
                className="w-full max-h-[60vh] object-contain mx-auto"
              />
            </div>

            <p className="text-sm text-cream/80 leading-relaxed mb-4 whitespace-pre-line">
              {activeModal.description}
            </p>

            {/* Direct WhatsApp Callout Banner */}
            <div className="mb-6 p-4 rounded-xl bg-gold/10 border border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} /> Masterpiece Handcrafted by Studio Owner
                </span>
                <p className="text-xs text-cream font-medium">
                  Would you like a custom piece in this style? Consult with Noor directly on WhatsApp.
                </p>
              </div>
              <a
                href={waLink(
                  settings.whatsapp || '8219811181',
                  `Hi Noor, I am looking at your artwork "${activeModal.title}" and would like to get a quote or book a session with you.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn text-xs !py-2 !px-4 shrink-0 flex items-center gap-1.5 shadow-md"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Noor Directly</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#143526]">
              <span className="text-xs text-muted">
                Atelier: Noor Tattooz Studio, Prem Nagar, Una (H.P.)
              </span>
              <div className="flex flex-wrap gap-2">
                <Link to="/booking" className="clay-btn ghost !py-2 !px-4 text-xs">
                  BOOK SIMILAR SESSION
                </Link>
                <button className="clay-btn ghost !py-2 !px-4 text-xs" onClick={() => setActiveModal(null)}>
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
