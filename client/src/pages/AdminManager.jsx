import { useEffect, useState, useCallback } from 'react';
import { api, errMsg, img } from '../api.js';
const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const set = (o, p, v) => { const c = structuredClone(o), ks = p.split('.'); let t = c; ks.slice(0, -1).forEach(k => t = t[k] ??= {}); t[ks.at(-1)] = v; return c; };
const f = (name, label, type = 'text', extra = {}) => ({ name, label, type, ...extra });
const SEO = [f('seo.title', 'SEO title'), f('seo.description', 'Meta description', 'textarea'), f('seo.canonical', 'Canonical URL')];
export const RES = {
  artists: { label: 'name', fields: [f('name', 'Name', 'text', { req: 1 }), f('image', 'Profile image', 'image'), f('imageAlt', 'Image alt text'), f('experience', 'Years of experience', 'number'), f('styles', 'Styles (comma separated)', 'csv'), f('specialties', 'Specialties (comma separated)', 'csv'), f('status', 'Status', 'select', { options: ['available', 'booked', 'away'] }), f('socialLinks.instagram', 'Instagram URL'), f('socialLinks.facebook', 'Facebook URL'), f('bio', 'Biography', 'textarea')] },
  gallery: { label: 'title', fields: [f('title', 'Title', 'text', { req: 1 }), f('image', 'Image', 'image'), f('imageAlt', 'Image alt text'), f('category', 'Category'), f('style', 'Style'), f('placement', 'Body Placement'), f('artist', 'Artist', 'ref'), f('tags', 'Tags (comma separated)', 'csv'), f('featured', 'Featured', 'bool'), f('description', 'Description', 'textarea')] },
  services: { label: 'title', fields: [f('title', 'Title', 'text', { req: 1 }), f('price', 'Starting price', 'number'), f('duration', 'Duration'), f('image', 'Image', 'image'), f('faqs', 'Service FAQs (one per line: question | answer)', 'qa'), f('description', 'Description', 'textarea'), ...SEO] },
  blog: { label: 'title', fields: [f('title', 'Title', 'text', { req: 1 }), f('slug', 'Slug (optional)'), f('author', 'Author'), f('category', 'Category'), f('tags', 'Tags (comma separated)', 'csv'), f('featuredImage', 'Featured image', 'image'), f('published', 'Published', 'bool'), f('excerpt', 'Excerpt', 'textarea'), f('content', 'Content', 'textarea'), ...SEO] },
  testimonials: { label: 'name', fields: [f('name', 'Name', 'text', { req: 1 }), f('rating', 'Rating (1-5)', 'number'), f('featured', 'Featured', 'bool'), f('message', 'Message', 'textarea')] },
  users: { label: 'email', fields: [f('name', 'Name', 'text', { req: 1 }), f('email', 'Email', 'text', { req: 1 }), f('role', 'Role', 'select', { options: ['editor', 'admin', 'super_admin'] }), f('status', 'Status', 'select', { options: ['active', 'disabled'] }), f('password', 'Password (12+ chars; leave blank to keep)', 'password')] },
  faqs: { label: 'question', fields: [f('question', 'Question', 'text', { req: 1 }), f('category', 'Category'), f('published', 'Published', 'bool'), f('answer', 'Answer', 'textarea')] },
};
export const SETTINGS = ['siteTitle', 'businessName', 'city', 'description', 'keywords', 'address', 'phone', 'email', 'hours', 'whatsapp', 'instagram', 'facebook', 'mapsUrl', 'ogImage', 'googleVerification'].map(k => f(k, k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()), ['hours', 'description'].includes(k) ? 'textarea' : 'text'));

export function Form({ fields, value, onSave, onCancel, refs = [] }) {
  const [v, setV] = useState(value), [busy, setBusy] = useState(false), [err, setErr] = useState('');
  const up = async (name, file) => { if (!file) return; const fd = new FormData(); fd.append('image', file); try { const r = await api.post('/admin/upload', fd); setV(x => set(x, name, r.data.url)); } catch (e) { setErr(errMsg(e)); } };
  const submit = async e => { e.preventDefault(); setBusy(true); setErr(''); try { await onSave(v); } catch (x) { setErr(errMsg(x)); } setBusy(false); };
  return <form onSubmit={submit} className="clay p-5 grid sm:grid-cols-2 gap-3 mb-6">
    {fields.map(fl => { const val = get(v, fl.name), on = x => setV(s => set(s, fl.name, x));
      return <label key={fl.name} className={`grid gap-1 text-sm content-start ${['textarea', 'qa'].includes(fl.type) ? 'sm:col-span-2' : ''}`}><span className="text-muted">{fl.label}</span>
        {fl.type === 'textarea' ? <textarea rows="5" className="field" value={val || ''} onChange={e => on(e.target.value)} />
          : fl.type === 'bool' ? <input type="checkbox" className="h-5 w-5" checked={!!val} onChange={e => on(e.target.checked)} />
          : fl.type === 'qa' ? <textarea rows="4" className="field" defaultValue={(val || []).map(x => `${x.q} | ${x.a}`).join('\n')} onBlur={e => on(e.target.value.split('\n').map(l => l.split('|')).filter(p => p.length > 1).map(p => ({ q: p[0].trim(), a: p.slice(1).join('|').trim() })))} />
          : fl.type === 'csv' ? <input className="field" defaultValue={(val || []).join(', ')} onBlur={e => on(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          : fl.type === 'select' ? <select className="field" value={val || fl.options[0]} onChange={e => on(e.target.value)}>{fl.options.map(o => <option key={o}>{o}</option>)}</select>
          : fl.type === 'ref' ? <select className="field" value={val || ''} onChange={e => on(e.target.value)}><option value="">None</option>{refs.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}</select>
          : fl.type === 'image' ? <><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => up(fl.name, e.target.files[0])} />{val && <img src={img(val)} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />}</>
          : <input type={fl.type === 'number' ? 'number' : fl.type === 'password' ? 'password' : 'text'} autoComplete={fl.type === 'password' ? 'new-password' : undefined} required={!!fl.req} className="field" value={val ?? ''} onChange={e => on(fl.type === 'number' && e.target.value !== '' ? +e.target.value : e.target.value)} />}</label>; })}
    {err && <p role="alert" className="sm:col-span-2 text-[var(--error)]">{err}</p>}
    <div className="sm:col-span-2 flex gap-3"><button disabled={busy} className="clay-btn">{busy ? 'SAVING…' : 'SAVE'}</button>{onCancel && <button type="button" onClick={onCancel} className="clay-btn ghost">CANCEL</button>}</div></form>;
}
export function Settings() {
  const [s, setS] = useState(null), [msg, setMsg] = useState('');
  useEffect(() => { api.get('/settings').then(r => setS(r.data)).catch(e => setMsg(errMsg(e))); }, []);
  return s ? <><p className="text-muted text-sm mb-3">Used for LocalBusiness SEO data, footer and contact page. Set your target city here.</p>{msg && <p role="status" className="mb-3">{msg}</p>}
    <Form fields={SETTINGS} value={s} onSave={async v => { const { _id, __v, createdAt, updatedAt, ...b } = v; await api.put('/admin/settings', b); setMsg('Settings saved'); }} /></> : <p className="text-muted">{msg || 'Loading…'}</p>;
}
export default function Manager({ kind }) {
  const cfg = RES[kind], [rows, setRows] = useState(null), [edit, setEdit] = useState(null), [err, setErr] = useState(''), [refs, setRefs] = useState([]);
  const load = useCallback(() => api.get(['blog', 'users'].includes(kind) ? `/admin/${kind}` : `/${kind}`, { params: { limit: 50 } }).then(r => setRows(r.data.items)).catch(e => setErr(errMsg(e))), [kind]);
  useEffect(() => { setRows(null); setEdit(null); load(); if (kind === 'gallery') api.get('/artists?limit=50').then(r => setRefs(r.data.items)).catch(() => {}); }, [load, kind]);
  const save = async v => {
    const { _id, __v, createdAt, updatedAt, ...b } = v;
    if (b.artist && typeof b.artist === 'object') b.artist = b.artist._id; if (!b.artist) delete b.artist; if (!b.slug) delete b.slug; if (!b.password) delete b.password;
    if (kind === 'blog' && b.published && !b.publishedAt) b.publishedAt = new Date().toISOString();
    await (_id ? api.put(`/admin/${kind}/${_id}`, b) : api.post(`/admin/${kind}`, b)); setEdit(null); load();
  };
  const del = async id => { if (confirm('Delete permanently?')) { try { await api.delete(`/admin/${kind}/${id}`); load(); } catch (e) { setErr(errMsg(e)); } } };
  return <div>{err && <p role="alert" className="text-[var(--error)] mb-3">{err}</p>}
    {edit ? <Form fields={cfg.fields} value={edit} refs={refs} onSave={save} onCancel={() => setEdit(null)} /> : <button className="clay-btn mb-4" onClick={() => setEdit({})}>+ ADD NEW</button>}
    {!rows ? <p className="text-muted">Loading…</p> : !rows.length ? <p className="text-muted">Nothing here yet.</p> : <div className="clay divide-y divide-[var(--border)]">{rows.map(r => <div key={r._id} className="flex items-center justify-between gap-3 p-3">
      <span className="truncate">{r[cfg.label]}{r.published === false && <em className="text-muted"> (draft)</em>}</span>
      <span className="flex gap-4 shrink-0"><button className="text-gold underline" onClick={() => setEdit(r)}>Edit</button><button className="text-[var(--error)] underline" onClick={() => del(r._id)}>Delete</button></span></div>)}</div>}</div>;
}
