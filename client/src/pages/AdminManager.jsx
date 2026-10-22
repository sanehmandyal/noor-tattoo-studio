import { useEffect, useState, useCallback } from 'react';
import { api, errMsg, img } from '../api.js';
const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const set = (o, p, v) => { const c = structuredClone(o), ks = p.split('.'); let t = c; ks.slice(0, -1).forEach(k => t = t[k] ??= {}); t[ks.at(-1)] = v; return c; };
const f = (name, label, type = 'text', extra = {}) => ({ name, label, type, ...extra });
const SEO = [f('seo.title', 'SEO title'), f('seo.description', 'Meta description', 'textarea'), f('seo.canonical', 'Canonical URL')];
export const RES = {
  gallery: { label: 'title', fields: [f('title', 'Tattoo Title', 'text', { req: 1 }), f('image', 'Tattoo Image', 'image'), f('imageAlt', 'Image alt text'), f('category', 'Category (e.g. Realism, Fine Line, Sleeve)'), f('style', 'Style (e.g. Black & Grey, Geometric)'), f('placement', 'Body Placement (e.g. Forearm, Shoulder)'), f('tags', 'Tags (comma separated)', 'csv'), f('featured', 'Featured on Homepage', 'bool'), f('description', 'Artistic Description', 'textarea')] },
  services: { label: 'title', fields: [f('title', 'Title', 'text', { req: 1 }), f('price', 'Starting price (₹)', 'number'), f('duration', 'Duration (e.g. 2 - 4 Hours)'), f('image', 'Image', 'image'), f('faqs', 'Service FAQs (one per line: question | answer)', 'qa'), f('description', 'Description', 'textarea'), ...SEO] },
  blog: { label: 'title', fields: [f('title', 'Title', 'text', { req: 1 }), f('slug', 'Slug (optional)'), f('author', 'Author'), f('category', 'Category'), f('tags', 'Tags (comma separated)', 'csv'), f('featuredImage', 'Featured image', 'image'), f('published', 'Published', 'bool'), f('excerpt', 'Excerpt', 'textarea'), f('content', 'Content', 'textarea'), ...SEO] },
  testimonials: { label: 'name', fields: [f('name', 'Client Name', 'text', { req: 1 }), f('service', 'Tattoo Piece / Service (e.g. Custom Realism Sleeve)'), f('location', 'Location (e.g. Una, Himachal Pradesh)'), f('source', 'Review Source (e.g. Google Maps)'), f('rating', 'Star Rating (1 - 5)', 'number'), f('verified', 'Verified Client', 'bool'), f('featured', 'Featured on Homepage', 'bool'), f('message', 'Honest Review Message', 'textarea', { req: 1 })] },
  faqs: { label: 'question', fields: [f('question', 'Question', 'text', { req: 1 }), f('category', 'Category'), f('published', 'Published', 'bool'), f('answer', 'Answer', 'textarea')] },
};
export const SETTINGS = ['siteTitle', 'businessName', 'city', 'description', 'keywords', 'address', 'phone', 'email', 'hours', 'whatsapp', 'instagram', 'facebook', 'mapsUrl', 'ogImage', 'googleVerification'].map(k => f(k, k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()), ['hours', 'description'].includes(k) ? 'textarea' : 'text'));

export function Form({ fields, value, onSave, onCancel, refs = [] }) {
  const [v, setV] = useState(value), [busy, setBusy] = useState(false), [err, setErr] = useState('');
  const up = async (name, file) => { if (!file) return; const fd = new FormData(); fd.append('image', file); try { const r = await api.post('/admin/upload', fd); setV(x => set(x, name, r.data.url)); } catch (e) { setErr(errMsg(e)); } };
  const submit = async e => { e.preventDefault(); setBusy(true); setErr(''); try { await onSave(v); } catch (x) { setErr(errMsg(x)); } setBusy(false); };
  return <form onSubmit={submit} className="glass-card p-6 grid sm:grid-cols-2 gap-4 mb-6">
    {fields.map(fl => { const val = get(v, fl.name), on = x => setV(s => set(s, fl.name, x));
      return <label key={fl.name} className={`grid gap-1.5 text-xs font-medium content-start ${['textarea', 'qa'].includes(fl.type) ? 'sm:col-span-2' : ''}`}><span className="text-muted">{fl.label}</span>
        {fl.type === 'textarea' ? <textarea rows="5" className="field" value={val || ''} onChange={e => on(e.target.value)} />
          : fl.type === 'bool' ? <div className="flex items-center gap-2 pt-1"><input type="checkbox" className="h-5 w-5 rounded border-line bg-dark/60 accent-gold" checked={!!val} onChange={e => on(e.target.checked)} /><span className="text-silver text-xs">Enable / Yes</span></div>
          : fl.type === 'qa' ? <textarea rows="4" className="field" defaultValue={(val || []).map(x => `${x.q} | ${x.a}`).join('\n')} onBlur={e => on(e.target.value.split('\n').map(l => l.split('|')).filter(p => p.length > 1).map(p => ({ q: p[0].trim(), a: p.slice(1).join('|').trim() })))} />
          : fl.type === 'csv' ? <input className="field" defaultValue={(val || []).join(', ')} onBlur={e => on(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          : fl.type === 'select' ? <select className="field" value={val || fl.options[0]} onChange={e => on(e.target.value)}>{fl.options.map(o => <option key={o}>{o}</option>)}</select>
          : fl.type === 'ref' ? <select className="field" value={val || ''} onChange={e => on(e.target.value)}><option value="">None</option>{refs.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}</select>
          : fl.type === 'image' ? <div className="space-y-2"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => up(fl.name, e.target.files[0])} className="text-xs text-muted" />{val && <img src={img(val)} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-gold/30" />}</div>
          : <input type={fl.type === 'number' ? 'number' : fl.type === 'password' ? 'password' : 'text'} autoComplete={fl.type === 'password' ? 'new-password' : undefined} required={!!fl.req} className="field" value={val ?? ''} onChange={e => on(fl.type === 'number' && e.target.value !== '' ? +e.target.value : e.target.value)} />}</label>; })}
    {err && <p role="alert" className="sm:col-span-2 text-[var(--error)] text-xs">{err}</p>}
    <div className="sm:col-span-2 flex items-center gap-3 pt-2"><button disabled={busy} className="clay-btn">{busy ? 'SAVING TO DATABASE…' : 'SAVE CHANGES'}</button>{onCancel && <button type="button" onClick={onCancel} className="clay-btn ghost">CANCEL</button>}</div></form>;
}
export function Settings() {
  const [s, setS] = useState(null), [msg, setMsg] = useState(''), [err, setErr] = useState('');
  const load = () => api.get('/settings').then(r => setS(r.data)).catch(e => setErr(errMsg(e)));
  useEffect(() => { load(); }, []);
  return s ? <div className="space-y-4">
    <div className="glass-card p-5 border border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-cream">Live Studio Configuration</h2>
        <p className="text-muted text-xs mt-1">Changes are saved directly to MongoDB and immediately reflect across the entire live website.</p>
      </div>
      <a href="/" target="_blank" rel="noopener noreferrer" className="clay-btn ghost text-xs shrink-0 inline-flex items-center gap-1.5">
        <span>VIEW LIVE SITE</span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>
    {msg && (
      <div className="p-3.5 rounded-xl border border-emerald/40 bg-emerald/10 text-emerald flex items-center justify-between text-xs font-semibold">
        <span>✓ {msg}</span>
        <a href="/" target="_blank" rel="noopener noreferrer" className="underline text-gold">Check live →</a>
      </div>
    )}
    {err && <p role="alert" className="text-[var(--error)] text-xs">{err}</p>}
    <Form fields={SETTINGS} value={s} onSave={async v => {
      const { _id, __v, createdAt, updatedAt, ...b } = v;
      await api.put('/admin/settings', b);
      setMsg('Studio settings successfully saved and synced with live site!');
      load();
    }} />
  </div> : <p className="text-muted text-sm">{err || 'Loading studio settings…'}</p>;
}
export default function Manager({ kind }) {
  const cfg = RES[kind], [rows, setRows] = useState(null), [edit, setEdit] = useState(null), [err, setErr] = useState(''), [refs, setRefs] = useState([]);
  const load = useCallback(() => api.get(kind === 'blog' ? `/admin/blog` : `/${kind}`, { params: { limit: 100 } }).then(r => setRows(r.data.items)).catch(e => setErr(errMsg(e))), [kind]);
  useEffect(() => { setRows(null); setEdit(null); load(); }, [load, kind]);
  const save = async v => {
    const { _id, __v, createdAt, updatedAt, ...b } = v;
    if (b.artist && typeof b.artist === 'object') b.artist = b.artist._id; if (!b.artist) delete b.artist; if (!b.slug) delete b.slug; if (!b.password) delete b.password;
    if (kind === 'blog' && b.published && !b.publishedAt) b.publishedAt = new Date().toISOString();
    await (_id ? api.put(`/admin/${kind}/${_id}`, b) : api.post(`/admin/${kind}`, b)); setEdit(null); load();
  };
  const del = async id => { if (confirm('Delete permanently?')) { try { await api.delete(`/admin/${kind}/${id}`); load(); } catch (e) { setErr(errMsg(e)); } } };
  return <div>{err && <p role="alert" className="text-[var(--error)] mb-3 text-xs">{err}</p>}
    {edit ? <Form fields={cfg.fields} value={edit} refs={refs} onSave={save} onCancel={() => setEdit(null)} /> : <button className="clay-btn mb-4 text-xs" onClick={() => setEdit({})}>+ ADD NEW {kind.toUpperCase()}</button>}
    {!rows ? <p className="text-muted text-sm">Loading data from database…</p> : !rows.length ? <p className="text-muted text-sm">No items in database yet. Click &quot;+ ADD NEW&quot; to create one.</p> :
      <div className="glass-card divide-y divide-[#17382a] overflow-hidden">{rows.map(r => <div key={r._id} className="flex items-center justify-between gap-3 p-3.5 hover:bg-emerald/5 transition">
        <div className="min-w-0">
          <span className="font-medium text-cream truncate block text-sm">{r[cfg.label]}</span>
          {r.service && <span className="text-xs text-gold/80 block">{r.service}</span>}
          {r.published === false && <em className="text-xs text-muted block">(draft)</em>}
        </div>
        <span className="flex items-center gap-3 shrink-0 text-xs">
          <button className="text-gold hover:underline font-semibold" onClick={() => setEdit(r)}>Edit</button>
          <span className="text-muted">·</span>
          <button className="text-[var(--error)] hover:underline" onClick={() => del(r._id)}>Delete</button>
        </span></div>)}</div>}</div>;
}
