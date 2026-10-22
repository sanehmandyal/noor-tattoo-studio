import { useEffect, useState, useCallback } from 'react';
import { api, errMsg, img } from '../api.js';
import {
  Plus, Edit3, Trash2, Check, ExternalLink, Image as ImageIcon,
  Sparkles, Star, FileText, HelpCircle, Save, X, Eye, UploadCloud
} from 'lucide-react';

const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const set = (o, p, v) => {
  const c = structuredClone(o), ks = p.split('.');
  let t = c;
  ks.slice(0, -1).forEach(k => t = t[k] ??= {});
  t[ks.at(-1)] = v;
  return c;
};

const f = (name, label, type = 'text', extra = {}) => ({ name, label, type, ...extra });
const SEO = [
  f('seo.title', 'SEO Page Title'),
  f('seo.description', 'Meta Description', 'textarea'),
  f('seo.canonical', 'Canonical URL')
];

export const RES = {
  gallery: {
    label: 'title',
    title: 'Portfolio Artworks',
    desc: 'Upload and manage original tattoo artworks displayed across the studio website and portfolio.',
    fields: [
      f('image', 'Tattoo Artwork Image (Upload Photo)', 'image', { req: 1 }),
      f('title', 'Tattoo Title / Concept', 'text', { req: 1 }),
      f('style', 'Style (e.g. Fine Line, Realism, Black & Grey, Japanese, Geometric)'),
      f('category', 'Category (e.g. Custom Sleeve, Minimalist, Floral, Spiritual)'),
      f('placement', 'Body Placement (e.g. Forearm, Shoulder, Ribcage, Back, Leg)'),
      f('featured', 'Feature on Homepage Gallery Showcase', 'bool'),
      f('imageAlt', 'Image Alt Description (for Google Search SEO)'),
      f('tags', 'Tags (comma separated, e.g. realism, floral, single-needle)', 'csv'),
      f('description', 'Artistic Vision & Tattoo Description', 'textarea')
    ]
  },
  services: {
    label: 'title',
    title: 'Studio Services & Treatments',
    desc: 'Manage bespoke tattoo styles, consultations, cover-ups, and specializations.',
    fields: [
      f('title', 'Service Title', 'text', { req: 1 }),
      f('duration', 'Estimated Duration (e.g. 2 - 4 Hours / Multi-Session)'),
      f('price', 'Estimate Reference (Optional, numeric)', 'number'),
      f('image', 'Service Feature Image', 'image'),
      f('description', 'Comprehensive Service Description', 'textarea'),
      f('faqs', 'Service FAQs (one per line: Question | Answer)', 'qa'),
      ...SEO
    ]
  },
  blog: {
    label: 'title',
    title: 'Blog Articles & Tattoo Guides',
    desc: 'Publish hygiene guides, tattoo aftercare education, and studio news.',
    fields: [
      f('title', 'Article Headline', 'text', { req: 1 }),
      f('slug', 'URL Slug (auto-generated if empty)'),
      f('author', 'Author Name (e.g. Noor)'),
      f('category', 'Category (e.g. Aftercare, Culture, Style Guide)'),
      f('tags', 'Tags (comma separated)', 'csv'),
      f('featuredImage', 'Cover Image', 'image'),
      f('published', 'Publish to Live Site', 'bool'),
      f('excerpt', 'Short Article Summary (1-2 sentences)', 'textarea'),
      f('content', 'Full Article Content (Markdown or plain text)', 'textarea'),
      ...SEO
    ]
  },
  testimonials: {
    label: 'name',
    title: 'Client Reviews & Testimonials',
    desc: 'Manage verified client feedback displayed on the public website and homepage.',
    fields: [
      f('name', 'Client Full Name', 'text', { req: 1 }),
      f('service', 'Tattoo Piece / Service (e.g. Custom Realism Sleeve)'),
      f('location', 'Client Location (e.g. Una, Himachal Pradesh)'),
      f('source', 'Review Platform (e.g. Google Maps, In-Studio)'),
      f('rating', 'Star Rating (1 to 5)', 'number'),
      f('verified', 'Verified Client Badge', 'bool'),
      f('featured', 'Pin to Homepage Review Carousel', 'bool'),
      f('message', 'Client Testimonial Message', 'textarea', { req: 1 })
    ]
  },
  faqs: {
    label: 'question',
    title: 'Frequently Asked Questions',
    desc: 'Address common questions about booking, hygiene, pain management, and healing.',
    fields: [
      f('question', 'Frequently Asked Question', 'text', { req: 1 }),
      f('category', 'Category (e.g. Booking, Aftercare, Pricing, Safety)'),
      f('published', 'Display on FAQ Page', 'bool'),
      f('answer', 'Detailed Studio Answer', 'textarea', { req: 1 })
    ]
  }
};

export function Form({ fields, value, onSave, onCancel, refs = [], title = 'Edit Record' }) {
  const [v, setV] = useState(value);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);

  const up = async (name, file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const r = await api.post('/admin/upload', fd);
      setV(x => set(x, name, r.data.url));
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setUploading(false);
    }
  };

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await onSave(v);
    } catch (x) {
      setErr(errMsg(x));
    }
    setBusy(false);
  };

  return (
    <div className="glass-card p-6 md:p-8 mb-8 border border-gold/30 shadow-2xl relative">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#163829]">
        <div>
          <h3 className="text-lg font-display font-bold text-cream flex items-center gap-2">
            <Sparkles size={16} className="text-gold" />
            <span>{value?._id ? `Edit: ${value.title || value.name || value.question || 'Record'}` : 'Create New Entry'}</span>
          </h3>
          <p className="text-xs text-muted mt-0.5">Fill in the fields below. Changes synchronize immediately with the live site.</p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-8 w-8 rounded-lg grid place-items-center text-muted hover:text-cream bg-[#05150f] hover:bg-[#0c2e1f] border border-[#163829] transition"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map(fl => {
          const val = get(v, fl.name);
          const on = x => setV(s => set(s, fl.name, x));
          const isWide = ['textarea', 'qa'].includes(fl.type) || fl.name.startsWith('seo.');

          return (
            <div
              key={fl.name}
              className={`flex flex-col gap-1.5 ${isWide ? 'md:col-span-2' : ''}`}
            >
              <label className="text-xs font-semibold text-silver flex items-center justify-between">
                <span>{fl.label} {fl.req && <span className="text-gold">*</span>}</span>
                {fl.name.startsWith('seo.') && (
                  <span className="text-[10px] text-gold/70 font-normal uppercase tracking-wider">SEO Setting</span>
                )}
              </label>

              {fl.type === 'textarea' ? (
                <textarea
                  rows={fl.name === 'content' ? 8 : 4}
                  className="field w-full font-sans text-xs leading-relaxed"
                  value={val || ''}
                  onChange={e => on(e.target.value)}
                  placeholder={`Enter ${fl.label.toLowerCase()}…`}
                />
              ) : fl.type === 'bool' ? (
                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#03110b] border border-[#143526] hover:border-gold/30 cursor-pointer transition">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#163829] bg-[#020a06] text-gold focus:ring-gold accent-gold"
                    checked={!!val}
                    onChange={e => on(e.target.checked)}
                  />
                  <span className="text-xs font-medium text-cream">Enable / Active</span>
                </label>
              ) : fl.type === 'qa' ? (
                <div className="space-y-1">
                  <textarea
                    rows={4}
                    className="field w-full text-xs"
                    defaultValue={(val || []).map(x => `${x.q} | ${x.a}`).join('\n')}
                    placeholder="Question | Answer (one per line)"
                    onBlur={e =>
                      on(
                        e.target.value
                          .split('\n')
                          .map(l => l.split('|'))
                          .filter(p => p.length > 1)
                          .map(p => ({ q: p[0].trim(), a: p.slice(1).join('|').trim() }))
                      )
                    }
                  />
                  <p className="text-[11px] text-muted">Format: <code>Question | Answer</code> (one FAQ per line)</p>
                </div>
              ) : fl.type === 'csv' ? (
                <input
                  className="field w-full text-xs"
                  defaultValue={(val || []).join(', ')}
                  placeholder="e.g. realism, sleeve, black & grey"
                  onBlur={e => on(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              ) : fl.type === 'image' ? (
                <div className="p-4 rounded-xl bg-[#03110b] border border-[#143526] space-y-3">
                  <div className="flex items-center gap-4">
                    {val ? (
                      <div className="relative group shrink-0">
                        <img
                          src={img(val)}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded-xl border border-gold/40 shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-xl bg-[#051811] border border-dashed border-[#1e4634] grid place-items-center text-muted shrink-0">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0a271c] hover:bg-[#103a2a] text-cream border border-gold/30 hover:border-gold cursor-pointer transition shadow-sm">
                        <UploadCloud size={14} className="text-gold" />
                        <span>{uploading ? 'Uploading image…' : 'Choose Image File'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={e => up(fl.name, e.target.files[0])}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      <p className="text-[11px] text-muted truncate">
                        {val ? `Current: ${val}` : 'Upload JPG, PNG or WebP'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <input
                  type={fl.type === 'number' ? 'number' : 'text'}
                  required={!!fl.req}
                  className="field w-full text-xs"
                  value={val ?? ''}
                  placeholder={`Enter ${fl.label.toLowerCase()}…`}
                  onChange={e => on(fl.type === 'number' && e.target.value !== '' ? +e.target.value : e.target.value)}
                />
              )}
            </div>
          );
        })}

        {err && (
          <div className="md:col-span-2 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-medium">
            {err}
          </div>
        )}

        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-[#163829]">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="clay-btn ghost text-xs !py-2.5 !px-5"
            >
              CANCEL
            </button>
          )}
          <button
            type="submit"
            disabled={busy || uploading}
            className="clay-btn text-xs !py-2.5 !px-6 inline-flex items-center gap-2"
          >
            <Save size={14} />
            <span>{busy ? 'SAVING TO DATABASE…' : 'SAVE CHANGES'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function Settings() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () =>
    api
      .get('/settings')
      .then(r => setS(r.data))
      .catch(e => setErr(errMsg(e)));

  useEffect(() => {
    load();
  }, []);

  const handleSave = async updated => {
    setSaving(true);
    setMsg('');
    setErr('');
    try {
      const { _id, __v, createdAt, updatedAt, ...cleanBody } = updated;
      await api.put('/admin/settings', cleanBody);
      setMsg('Studio settings saved successfully & synced with live website!');
      load();
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      title: 'Studio Profile & Contact Information',
      subtitle: 'Primary contact channels shown across the website header, footer, and booking modules.',
      fields: [
        f('businessName', 'Studio Business Name', 'text', { req: 1 }),
        f('siteTitle', 'Public Site Title', 'text', { req: 1 }),
        f('city', 'Studio City / Region'),
        f('phone', 'Studio Direct Call Phone Number', 'text', { req: 1 }),
        f('whatsapp', 'Official WhatsApp Number (with country code, e.g. 918219811181)', 'text', { req: 1 }),
        f('email', 'Public Studio Email', 'text', { req: 1 }),
        f('address', 'Complete Street Address (Una Amb Road)', 'textarea'),
        f('hours', 'Operating Hours (Displayed on footer & booking)', 'textarea')
      ]
    },
    {
      title: 'Social Profiles & Google Maps Link',
      subtitle: 'External links for clients to view studio social channels and find driving directions.',
      fields: [
        f('instagram', 'Official Instagram Profile URL (e.g. https://www.instagram.com/noortattooz)'),
        f('facebook', 'Studio Facebook Profile URL'),
        f('mapsUrl', 'Google Maps Location / Profile URL')
      ]
    },
    {
      title: 'Search Engine Optimization (SEO) & Verification',
      subtitle: 'Metadata utilized by Google, social share preview cards, and search indexers.',
      fields: [
        f('description', 'Default Meta Description', 'textarea'),
        f('keywords', 'Meta Search Keywords (comma separated)'),
        f('ogImage', 'Social Share Preview Banner Image URL'),
        f('googleVerification', 'Google Search Console Verification Tag')
      ]
    }
  ];

  return s ? (
    <div className="space-y-6">
      {/* Settings Header Card */}
      <div className="glass-card p-6 border border-gold/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-display font-bold text-cream">Live Studio Configuration</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald/15 text-emerald border border-emerald/30">
              Live Synchronized
            </span>
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Every field below is stored in production MongoDB and immediately updates the public website without redeploying.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="clay-btn ghost text-xs inline-flex items-center gap-1.5 shrink-0 !py-2 !px-4"
        >
          <span>PREVIEW LIVE SITE</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {msg && (
        <div className="p-4 rounded-xl border border-emerald/40 bg-emerald/10 text-emerald flex items-center justify-between text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>{msg}</span>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="underline text-gold hover:text-cream">
            View Live Site →
          </a>
        </div>
      )}

      {err && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/40 text-red-300 text-xs font-semibold">
          {err}
        </div>
      )}

      {/* Grouped Settings Form */}
      <div className="space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="glass-card p-6 border border-gold/15">
            <div className="pb-3 mb-5 border-b border-[#143526]">
              <h3 className="text-sm font-bold text-cream uppercase tracking-wider">{sec.title}</h3>
              <p className="text-xs text-muted mt-0.5">{sec.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sec.fields.map(fl => {
                const val = s[fl.name];
                const isWide = fl.type === 'textarea';
                return (
                  <div key={fl.name} className={`flex flex-col gap-1 ${isWide ? 'md:col-span-2' : ''}`}>
                    <label className="text-xs font-semibold text-silver">
                      {fl.label} {fl.req && <span className="text-gold">*</span>}
                    </label>
                    {fl.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        className="field w-full text-xs"
                        value={val || ''}
                        onChange={e => setS({ ...s, [fl.name]: e.target.value })}
                      />
                    ) : (
                      <input
                        type="text"
                        className="field w-full text-xs"
                        value={val ?? ''}
                        onChange={e => setS({ ...s, [fl.name]: e.target.value })}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleSave(s)}
            disabled={saving}
            className="clay-btn text-xs !py-3 !px-8 inline-flex items-center gap-2 shadow-xl"
          >
            <Save size={15} />
            <span>{saving ? 'SYNCHRONIZING WITH DATABASE…' : 'SAVE & APPLY ALL SETTINGS'}</span>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="glass-card p-12 text-center text-muted text-sm border border-gold/15">
      {err ? (
        <span className="text-red-400">{err}</span>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span>Loading studio configuration from database…</span>
        </div>
      )}
    </div>
  );
}

export default function Manager({ kind }) {
  const cfg = RES[kind];
  const [rows, setRows] = useState(null);
  const [edit, setEdit] = useState(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');

  const load = useCallback(() => {
    const url = kind === 'blog' ? '/admin/blog' : `/${kind}`;
    return api
      .get(url, { params: { limit: 100 } })
      .then(r => setRows(r.data.items || []))
      .catch(e => setErr(errMsg(e)));
  }, [kind]);

  useEffect(() => {
    setRows(null);
    setEdit(null);
    load();
  }, [load, kind]);

  const save = async v => {
    const { _id, __v, createdAt, updatedAt, ...clean } = v;
    if (clean.artist && typeof clean.artist === 'object') clean.artist = clean.artist._id;
    if (!clean.artist) delete clean.artist;
    if (!clean.slug) delete clean.slug;
    if (!clean.password) delete clean.password;
    if (kind === 'blog' && clean.published && !clean.publishedAt) {
      clean.publishedAt = new Date().toISOString();
    }
    if (_id) {
      await api.put(`/admin/${kind}/${_id}`, clean);
    } else {
      await api.post(`/admin/${kind}`, clean);
    }
    setEdit(null);
    load();
  };

  const del = async id => {
    if (confirm('Are you sure you want to permanently delete this item?')) {
      try {
        await api.delete(`/admin/${kind}/${id}`);
        load();
      } catch (e) {
        setErr(errMsg(e));
      }
    }
  };

  if (!cfg) return null;

  const filteredRows = (rows || []).filter(r => {
    if (!q.trim()) return true;
    const term = q.toLowerCase();
    const target = (r[cfg.label] || '') + ' ' + (r.category || '') + ' ' + (r.style || '') + ' ' + (r.service || '');
    return target.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="glass-card p-6 border border-gold/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-display font-bold text-cream">{cfg.title}</h2>
            {rows !== null && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold/15 text-gold border border-gold/30">
                {rows.length} Total
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-1">{cfg.desc}</p>
        </div>

        {!edit && (
          <button
            onClick={() => setEdit({})}
            className="clay-btn text-xs !py-2.5 !px-5 inline-flex items-center gap-2 shrink-0 shadow-lg"
          >
            <Plus size={15} />
            <span>ADD NEW {cfg.title.split(' ')[0].toUpperCase()}</span>
          </button>
        )}
      </div>

      {err && (
        <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-950/40 text-red-300 text-xs font-medium">
          {err}
        </div>
      )}

      {/* Edit or Create Form */}
      {edit ? (
        <Form
          fields={cfg.fields}
          value={edit}
          onSave={save}
          onCancel={() => setEdit(null)}
          title={cfg.title}
        />
      ) : (
        <div className="space-y-4">
          {/* Search bar */}
          {rows && rows.length > 0 && (
            <div className="flex items-center gap-3">
              <input
                className="field text-xs max-w-sm"
                placeholder={`Search ${cfg.title.toLowerCase()}…`}
                value={q}
                onChange={e => setQ(e.target.value)}
              />
              {q && (
                <button onClick={() => setQ('')} className="text-xs text-muted hover:text-cream">
                  Clear filter
                </button>
              )}
            </div>
          )}

          {/* Records Display */}
          {!rows ? (
            <div className="glass-card p-12 text-center text-muted text-sm border border-gold/15 flex flex-col items-center gap-3">
              <div className="h-6 w-6 rounded-full border-2 border-gold border-t-transparent animate-spin" />
              <span>Loading {cfg.title.toLowerCase()} from MongoDB…</span>
            </div>
          ) : !filteredRows.length ? (
            <div className="glass-card p-12 text-center text-muted text-sm border border-gold/15 space-y-3">
              <p>No items found{q ? ` matching "${q}"` : ' in this category yet'}.</p>
              <button
                onClick={() => setEdit({})}
                className="clay-btn text-xs inline-flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Create First {cfg.title.split(' ')[0]}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRows.map(r => (
                <div
                  key={r._id}
                  className="glass-card p-4 border border-gold/15 hover:border-gold/35 transition flex flex-col justify-between gap-3 group relative"
                >
                  <div className="space-y-2">
                    {/* Optional Thumbnail Image */}
                    {(r.image || r.featuredImage) && (
                      <div className="h-36 w-full rounded-xl overflow-hidden bg-[#03110b] border border-[#143526]">
                        <img
                          src={img(r.image || r.featuredImage)}
                          alt={r[cfg.label]}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-cream text-sm leading-snug line-clamp-2">
                        {r[cfg.label]}
                      </h4>
                      {r.featured && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/40">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Metadata Subtitles */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                      {r.category && (
                        <span className="px-2 py-0.5 rounded-md bg-[#0a2318] text-silver border border-[#143526]">
                          {r.category}
                        </span>
                      )}
                      {r.style && (
                        <span className="px-2 py-0.5 rounded-md bg-[#0a2318] text-silver border border-[#143526]">
                          {r.style}
                        </span>
                      )}
                      {r.placement && <span className="text-gold/80">{r.placement}</span>}
                      {r.rating && (
                        <span className="text-gold font-bold">
                          {'★'.repeat(r.rating)} ({r.rating}/5)
                        </span>
                      )}
                      {r.published === false && <span className="text-red-400 font-medium">(Draft)</span>}
                    </div>

                    {r.description && (
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {r.description}
                      </p>
                    )}
                    {r.message && (
                      <p className="text-xs text-muted italic line-clamp-3 leading-relaxed">
                        &quot;{r.message}&quot;
                      </p>
                    )}
                    {r.answer && (
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {r.answer}
                      </p>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#143526] text-xs">
                    <span className="text-[11px] text-muted">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEdit(r)}
                        className="inline-flex items-center gap-1 text-gold hover:text-cream transition font-semibold"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => del(r._id)}
                        className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
