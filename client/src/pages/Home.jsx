import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Sparkles, Award, Clock, ArrowRight, Star,
  CheckCircle2, Compass, Heart, Coffee, Feather, Eye, Layers, ChevronRight, Instagram
} from 'lucide-react';
import { api, img, waLink } from '../api.js';
import { SEO } from '../App.jsx';

export default function Home() {
  const [featuredGallery, setFeaturedGallery] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [posts, setPosts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {});
    api.get('/gallery?featured=true&limit=6').then(r => setFeaturedGallery(r.data.items || [])).catch(() => {});
    api.get('/services?limit=6').then(r => setServices(r.data.items || [])).catch(() => {});
    api.get('/testimonials?limit=20').then(r => setTestimonials(r.data.items || [])).catch(() => {});
    api.get('/blog?limit=3').then(r => setPosts(r.data.items || [])).catch(() => {});
    api.get('/faqs?limit=4').then(r => setFaqs(r.data.items || [])).catch(() => {});
  }, []);

  const styles = [
    { name: 'Fine Line & Single Needle', desc: 'Single-needle botanicals, celestial maps and delicate typography', tag: 'Fine Line', slug: 'fine-line', img: '/tattoos/fineline-botanical.jpg' },
    { name: 'Dark Realism & Portraits', desc: 'Chiaroscuro depth, wildlife studies and lifelike memory portraits', tag: 'Realism', slug: 'realism', img: '/tattoos/realism-portrait.jpg' },
    { name: 'Modern Japanese Irezumi', desc: 'Modern dragons, ceremonial peonies, koi and dynamic wave bars', tag: 'Japanese', slug: 'japanese', img: '/tattoos/japanese-dragon.jpg' },
    { name: 'Sacred Geometry & Mandalas', desc: 'Anatomical mandalas, fibonacci ratios and micro-dotwork grids', tag: 'Geometric', slug: 'geometric', img: '/tattoos/geometric-sleeve.jpg' },
    { name: 'Brutalist Blackwork & Gothic', desc: 'Saturated black pigments, ornamental bands and heavy contrast', tag: 'Blackwork', slug: 'black-and-grey', img: '/tattoos/blackwork-gothic.jpg' },
    { name: 'Custom Concepts & Cover-Ups', desc: 'Transformative camouflage art turning past marks into living beauty', tag: 'Custom Designs', slug: 'custom-designs', img: '/tattoos/tattoo-craft.jpg' },
  ];

  const steps = [
    { num: '01', title: 'Private Design Consultation', desc: 'Meet your artist over artisanal coffee in our private lounge. We discuss your story, examine your anatomy, and evaluate references with zero pressure.' },
    { num: '02', title: 'Custom 3D Stencil & Mapping', desc: 'Your artist drafts a 100% original bespoke illustration. We map the stencil directly to your muscle flow to ensure it looks natural in movement.' },
    { num: '03', title: 'The Gentle Sterile Session', desc: 'Unwind in an ergonomic clinical chair inside a private climate-controlled bay. We use sterile single-use Kwadron cartridges and vegan carbon pigments.' },
    { num: '04', title: 'Medical Shield & 60-Day Guarantee', desc: 'We seal your piece with breathable Saniderm film and provide medical aftercare balm. Every piece includes a complimentary touch-up within 60 days.' },
  ];

  return (
    <>
      <SEO
        title="Noor Tattooz Studio Una | Best Tattoo Studio in Himachal Pradesh"
        description="Noor Tattooz Studio is the premier tattoo atelier on Una Amb Road near Sabji Mandi, Prem Nagar, Una, Himachal Pradesh 174303. Custom tattoos, realism, and sterile precision."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 md:py-24 border-b border-[#17382a]">
        {/* Deep Emerald Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15)_0%,_transparent_70%)] pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a261c] border border-gold/40 text-gold text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
              <Sparkles size={13} className="text-emerald" />
              <span>Premier Tattoo Atelier · Una, Himachal Pradesh</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
              SACRED ART ON <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#fff2cf] to-gold">
                LIVING CANVAS.
              </span>
            </h1>

            <p className="text-muted text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Experience the pinnacle of custom tattoo craftsmanship in Himachal Pradesh. Located on Una Amb Road near Sabji Mandi in Prem Nagar, every piece at <strong className="text-silver">Noor Tattooz Studio</strong> is drawn with surgical hygiene and artistic dedication.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <Link to="/booking" className="clay-btn text-xs sm:text-sm !py-3 !px-6">
                <span>RESERVE A SESSION</span>
                <ArrowRight size={15} />
              </Link>
              <Link to="/gallery" className="clay-btn ghost text-xs sm:text-sm !py-3 !px-5">
                <span>VIEW PORTFOLIO</span>
              </Link>
              <a
                href={settings.mapsUrl || "https://share.google/byos1q4FITCvikbhe"}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill !py-2.5 !px-3.5 hover:border-gold transition text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Star size={13} className="fill-gold text-gold" />
                <span className="text-cream">5.0 Star on Google Maps</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-6 border-t border-[#17382a]/70">
              <div className="glass-card p-3 text-center border-gold/15">
                <span className="font-display text-xl sm:text-2xl font-bold text-gold block">Una</span>
                <span className="text-[11px] text-muted">Prem Nagar Atelier</span>
              </div>
              <div className="glass-card p-3 text-center border-gold/15">
                <span className="font-display text-xl sm:text-2xl font-bold text-gold block">100%</span>
                <span className="text-[11px] text-muted">Custom Artworks</span>
              </div>
              <div className="glass-card p-3 text-center border-gold/15">
                <span className="font-display text-xl sm:text-2xl font-bold text-gold block flex items-center justify-center gap-1">
                  5.0 <Star size={14} className="fill-gold text-gold" />
                </span>
                <span className="text-[11px] text-muted">Google Reviews</span>
              </div>
              <div className="glass-card p-3 text-center border-emerald/25">
                <span className="font-display text-xl sm:text-2xl font-bold text-emerald block">100%</span>
                <span className="text-[11px] text-muted">Sterile Single-Use</span>
              </div>
            </div>
          </motion.div>

          {/* New Logo Showcase Hero Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.25)_0%,_rgba(223,183,80,0.12)_50%,_transparent_75%)] blur-2xl -z-10" />
              <div className="glass-card p-3 relative overflow-hidden rounded-[2rem] border border-gold/30 shadow-2xl">
                <div className="relative aspect-[4/5] rounded-[1.4rem] overflow-hidden bg-[#071d15]">
                  <img
                    src="/hero-tattoo.jpg"
                    alt="Master Tattoo Artist Crafting Custom Ink at Noor Tattooz Studio Una"
                    width="600"
                    height="750"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020b07]/90 via-[#020b07]/10 to-transparent pointer-events-none" />

                  {/* Live Atelier Badge */}
                  <div className="absolute top-3.5 right-3.5 bg-[#04120c]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold/30 flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                    <span className="text-[10px] font-semibold text-silver tracking-wider uppercase">Prem Nagar Studio</span>
                  </div>

                  {/* Bottom Information Card */}
                  <div className="absolute bottom-3.5 inset-x-3.5 bg-[#04120c]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#1b3d2f] text-left flex items-center justify-between shadow-xl">
                    <div>
                      <p className="text-[10px] tracking-widest text-gold uppercase font-bold">Noor Tattooz Atelier</p>
                      <p className="text-xs font-medium text-silver mt-0.5">Una Amb Road · Prem Nagar (H.P.)</p>
                    </div>
                    <Link
                      to="/gallery"
                      className="text-xs font-semibold text-gold hover:text-cream transition flex items-center gap-0.5"
                    >
                      Gallery ›
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The 4 Studio Pillars */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-semibold">The Noor Standard</span>
          <h2 className="text-3xl sm:text-4xl font-bold">CRAFTED FOR A LIFETIME</h2>
          <p className="text-muted text-sm mt-3">
            A tattoo is one of the only permanent possessions you will ever own. We treat every square inch with reverence, surgical hygiene, and artistic integrity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 relative group hover:-translate-y-1 transition duration-300">
            <div className="h-12 w-12 rounded-xl bg-gold/15 text-gold grid place-items-center mb-5 border border-gold/30">
              <Feather size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-cream">100% Bespoke Art</h3>
            <p className="text-xs text-muted leading-relaxed">
              Zero copied stencils. Every line is custom illustrated from your narrative to harmonize with your muscle contours.
            </p>
          </div>

          <div className="glass-card p-6 relative group hover:-translate-y-1 transition duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald/15 text-emerald grid place-items-center mb-5 border border-emerald/30">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-cream">Hospital Sterility</h3>
            <p className="text-xs text-muted leading-relaxed">
              Sealed single-use Cheyenne blister cartridges, medical autoclave protocols, and international pathogen certifications.
            </p>
          </div>

          <div className="glass-card p-6 relative group hover:-translate-y-1 transition duration-300">
            <div className="h-12 w-12 rounded-xl bg-gold/15 text-gold grid place-items-center mb-5 border border-gold/30">
              <Coffee size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-cream">Private Sanctuary</h3>
            <p className="text-xs text-muted leading-relaxed">
              Quiet climate-controlled private rooms, calming ambient soundscape, artisanal coffee, and complete client privacy.
            </p>
          </div>

          <div className="glass-card p-6 relative group hover:-translate-y-1 transition duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald/15 text-emerald grid place-items-center mb-5 border border-emerald/30">
              <Award size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-cream">60-Day Guarantee</h3>
            <p className="text-xs text-muted leading-relaxed">
              Medical-grade breathable dermal shield included, plus one complimentary touch-up within 60 days once fully healed.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Gallery */}
      <section className="py-20 bg-[#030f0a] border-y border-[#17382a]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-semibold">Curated Portfolio</span>
              <h2 className="text-3xl sm:text-4xl font-bold">RECENT MASTERPIECES</h2>
            </div>
            <Link to="/gallery" className="clay-btn ghost !py-2.5 !px-5 text-xs flex items-center gap-2 self-start md:self-auto">
              <span>EXPLORE ALL WORK</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGallery.map(piece => (
              <article key={piece._id} className="clay overflow-hidden group flex flex-col">
                <div className="relative overflow-hidden aspect-[4/3] bg-[#071d15]">
                  <img
                    src={img(piece.image)}
                    alt={piece.imageAlt || piece.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#04100b]/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-gold border border-gold/30">
                    {piece.style}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-cream group-hover:text-gold transition">
                      {piece.title}
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      Atelier: <span className="text-silver">Noor Tattooz Atelier</span>
                    </p>
                    <p className="text-xs text-muted/80 mt-2 line-clamp-2 leading-relaxed">
                      {piece.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#17382a] flex items-center justify-between text-xs">
                    <span className="text-gold/90">{piece.tags?.slice(0, 2).map(t => `#${t}`).join(' ')}</span>
                    <Link to={`/gallery/${piece.slug}`} className="text-gold hover:underline flex items-center gap-1 font-semibold">
                      Details <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Disciplines Explorer */}
      <section className="py-20 bg-[#030f0a] border-y border-[#17382a]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-semibold">Aesthetic Mastery</span>
              <h2 className="text-3xl sm:text-4xl font-bold">SIGNATURE TATTOO DISCIPLINES</h2>
              <p className="text-muted text-sm mt-2">
                Explore the distinct techniques and visual languages our studio crafts daily.
              </p>
            </div>
            <Link to="/styles" className="clay-btn ghost !py-2.5 !px-5 text-xs flex items-center gap-2 self-start md:self-auto">
              <span>EXPLORE ALL STYLES</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map(s => (
              <Link
                key={s.name}
                to={`/styles/${s.slug}`}
                className="glass-card p-6 group hover:border-gold/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full rounded-xl overflow-hidden mb-5 bg-[#0a2218]">
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-cream group-hover:text-gold transition">{s.name}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#17382a] flex items-center justify-between text-xs text-gold font-semibold">
                  <span>Explore {s.tag} Guide</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The 4-Step Journey */}
      <section className="py-20 bg-[#030f0a] border-y border-[#17382a]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-semibold">The Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold">FROM INCEPTION TO INK</h2>
            <p className="text-muted text-sm mt-3">
              What to expect from your first inquiry to your fully healed permanent artwork.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {steps.map(step => (
              <div key={step.num} className="glass-card p-6 relative">
                <span className="font-display text-4xl font-bold text-gold/30 block mb-4">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-cream mb-2">{step.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/process" className="clay-btn ghost text-xs inline-flex items-center gap-2">
              <span>EXPLORE FULL 6-STAGE PROCESS & PREP GUIDE</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Hygiene Protocol Banner */}
      <section className="py-14 bg-gradient-to-r from-[#061b13] via-[#0b291d] to-[#061b13] border-b border-[#17382a]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-emerald/15 text-emerald grid place-items-center shrink-0 border border-emerald/40">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-cream">Clinical Hospital-Grade Safety Protocol</h3>
              <p className="text-sm text-muted mt-1 max-w-2xl leading-relaxed">
                All needle cartridges are sealed, single-use, opened in front of you, and discarded in biohazard sharps containers. We use 100% vegan, cruelty-free, heavy-metal-free carbon pigments.
              </p>
            </div>
          </div>
          <Link to="/hygiene" className="clay-btn ghost text-xs whitespace-nowrap">
            STUDIO SAFETY STANDARDS
          </Link>
        </div>
      </section>

      {/* Client Reviews - Elevated Google Maps Honest Feedback */}
      <section className="py-24 max-w-6xl mx-auto px-4 relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-48 bg-gold/5 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 glass-pill mb-3">
            <span className="flex text-gold">★★★★★</span>
            <span className="text-cream font-bold">5.0 Star Rated on Google Maps</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-cream">
            HONEST REVIEWS FROM REAL CLIENTS
          </h2>
          <p className="text-muted text-sm mt-3 leading-relaxed">
            Real feedback from clients who got inked at Noor Tattooz Studio on Una Amb Road, near Sabji Mandi, Prem Nagar. Every review reflects authentic studio sessions.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href={settings.mapsUrl || "https://share.google/byos1q4FITCvikbhe"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold hover:text-cream underline font-semibold inline-flex items-center gap-1.5"
            >
              <span>View live Google Maps business profile</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map(t => (
            <article key={t._id} className="glass-card p-6 flex flex-col justify-between group hover:border-gold/50 transition duration-300">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-gold" />
                    ))}
                  </div>
                  {t.service && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                      {t.service}
                    </span>
                  )}
                </div>
                <p className="text-sm text-cream/90 leading-relaxed italic relative">
                  “{t.message}”
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#17382a] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold/30 to-emerald/30 border border-gold/40 grid place-items-center font-display font-bold text-cream text-xs shrink-0">
                    {t.name ? t.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-cream">{t.name}</h4>
                    <span className="text-[11px] text-emerald flex items-center gap-1 font-medium">
                      <CheckCircle2 size={12} /> {t.source || 'Google Verified Review'}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-muted text-right shrink-0">
                  {t.location || 'Una Studio'}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Action Callouts */}
        <div className="glass-card p-6 border border-gold/25 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-bold text-cream">Loved your experience with Noor Tattooz?</h3>
            <p className="text-xs text-muted mt-0.5">Help others in Una discover honest tattoo craftsmanship by sharing your review.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={settings.mapsUrl || "https://share.google/byos1q4FITCvikbhe"}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn text-xs !py-2.5 !px-4 inline-flex items-center gap-2"
            >
              <span>WRITE A GOOGLE REVIEW</span>
              <span aria-hidden="true">✍</span>
            </a>
            <a
              href={settings.mapsUrl || "https://share.google/byos1q4FITCvikbhe"}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn ghost text-xs !py-2.5 !px-4 inline-flex items-center gap-2"
            >
              <span>READ ALL ON GOOGLE MAPS</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Studio FAQ Quick Section */}
      {faqs.length > 0 && (
        <section className="py-20 bg-[#030e09] border-y border-[#17382a]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-semibold">Got Questions?</span>
              <h2 className="text-3xl sm:text-4xl font-bold">FREQUENTLY ASKED QUESTIONS</h2>
              <p className="text-muted text-sm mt-2">
                Honest answers regarding pain, hygiene, deposits, and healing.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {faqs.map(f => (
                <details key={f._id} className="glass-card p-5 group open:border-gold/40">
                  <summary className="font-semibold text-cream text-sm sm:text-base cursor-pointer list-none flex items-center justify-between gap-4">
                    <span>{f.question}</span>
                    <span className="text-gold text-base transition-transform group-open:rotate-45 shrink-0">+</span>
                  </summary>
                  <p className="mt-3 pt-3 border-t border-[#17382a] text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-line">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="text-center">
              <Link to="/faq" className="clay-btn ghost text-xs inline-flex items-center gap-2">
                <span>VIEW ALL FREQUENTLY ASKED QUESTIONS</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Instagram Spotlight Banner */}
      <section className="py-14 bg-[#030d08] border-y border-[#17382a] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Instagram size={32} className="text-gold mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-2">FOLLOW OUR JOURNEY ON INSTAGRAM</h3>
          <p className="text-sm text-muted max-w-md mx-auto mb-6">
            Watch daily behind-the-scenes stencil drafting, fresh piece reveals, and healed client check-ins.
          </p>
          <a
            href="https://instagram.com/noor_tattooz"
            target="_blank"
            rel="noopener noreferrer"
            className="clay-btn"
          >
            JOIN @NOOR_TATTOOZ
          </a>
        </div>
      </section>

      {/* Final Luxury Booking CTA */}
      <section className="py-24 text-center max-w-4xl mx-auto px-4">
        <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-3 font-semibold">
          Begin Your Permanent Journey
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          READY TO IMMORTALIZE YOUR STORY?
        </h2>
        <p className="text-muted text-base max-w-xl mx-auto mb-10 leading-relaxed">
          Book your complimentary 1-on-1 consultation at our Una studio (Prem Nagar, Una Amb Road). Share your ideas, discuss anatomy and placement, and let us bring your vision to life.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link to="/booking" className="clay-btn">
            BOOK A CONSULTATION
          </Link>
          {settings.whatsapp && (
            <a
              href={waLink(settings.whatsapp, 'Hi Noor Tattooz, I would like to book a consultation.')}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn ghost"
            >
              CHAT ON WHATSAPP
            </a>
          )}
        </div>
      </section>
    </>
  );
}
