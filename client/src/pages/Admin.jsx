import Manager, { Settings } from './AdminManager.jsx';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useCallback } from 'react';
import { api, errMsg } from '../api.js';
const STATUS = { bookings: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], inquiries: ['new', 'read', 'replied'] };
function Login({ onLogin }) {
  const [f, setF] = useState({ email: '', password: '' }), [err, setErr] = useState('');
  const go = async e => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/auth/login', f);
      if (res.data.token) {
        localStorage.setItem('noor_auth_token', res.data.token);
      }
      onLogin(res.data.user);
    } catch (x) {
      setErr(errMsg(x));
    }
  };
  return (<div className="min-h-screen grid place-items-center p-4"><form onSubmit={go} className="clay p-8 w-full max-w-sm grid gap-4">
    <img src="/logo.png" alt="Noor Tattoo Studio" width="96" height="96" className="mx-auto rounded-full" /><h1 className="text-2xl text-center">Admin Login</h1>
    <label className="grid gap-1 text-sm">Email<input type="email" required className="field" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></label>
    <label className="grid gap-1 text-sm">Password<input type="password" required className="field" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></label>
    {err && <p role="alert" className="text-[var(--error)] text-sm">{err}</p>}<button className="clay-btn">SIGN IN</button><a href="/admin/forgot" className="text-gold underline text-sm text-center">Forgot password?</a></form></div>);
}
function Table({ kind }) {
  const [rows, setRows] = useState(null), [status, setStatus] = useState(''), [q, setQ] = useState(''), [err, setErr] = useState('');
  const load = useCallback(() => api.get(`/admin/${kind}`, { params: { status, q } }).then(r => setRows(r.data.items)).catch(e => setErr(errMsg(e))), [kind, status, q]);
  useEffect(() => { setRows(null); load(); }, [load]);
  const patch = async (id, body) => { try { await api.patch(`/admin/${kind}/${id}`, body); load(); } catch (e) { setErr(errMsg(e)); } };
  const del = async id => { if (confirm('Delete permanently?')) { try { await api.delete(`/admin/${kind}/${id}`); load(); } catch (e) { setErr(errMsg(e)); } } };
  return (<div><div className="flex flex-wrap gap-3 mb-4"><input className="field max-w-xs" placeholder="Search name/email" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
    <select className="field max-w-[12rem]" value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{STATUS[kind].map(s => <option key={s}>{s}</option>)}</select></div>
    {err && <p role="alert" className="text-[var(--error)] mb-3">{err}</p>}
    {!rows ? <p className="text-muted">Loading…</p> : !rows.length ? <p className="text-muted">Nothing here yet.</p> :
      <div className="overflow-x-auto clay"><table className="w-full text-sm"><thead className="text-left text-muted"><tr><th className="p-3">Name</th><th>Details</th><th>Status</th><th>Notes</th><th /></tr></thead><tbody>
        {rows.map(r => <tr key={r._id} className="border-t border-line align-top"><td className="p-3">{r.name}<br /><span className="text-muted">{r.email}</span></td>
          <td className="pr-3 max-w-xs">{kind === 'bookings' ? `${r.date} ${r.time} · ${r.style} · ${r.placement}` : r.subject}<br /><span className="text-muted">{r.description || r.message}</span></td>
          <td><select className="field" value={r.status} onChange={e => patch(r._id, { status: e.target.value })} aria-label="Status">{STATUS[kind].map(s => <option key={s}>{s}</option>)}</select></td>
          <td><input className="field" defaultValue={r.notes || ''} placeholder="Internal note" onBlur={e => e.target.value !== (r.notes || '') && patch(r._id, { notes: e.target.value })} aria-label="Internal notes" /></td>
          <td className="p-3"><button onClick={() => del(r._id)} className="text-[var(--error)] underline">Delete</button></td></tr>)}</tbody></table></div>}</div>);
}
const Bars = ({ title, data }) => { const max = Math.max(1, ...data.map(d => d[1])); return <div className="clay p-4"><h2 className="text-sm text-muted mb-3">{title}</h2>{!data.length ? <p className="text-muted text-sm">No data yet.</p> : data.map(([k, v]) => <div key={k} className="flex items-center gap-2 text-xs mb-2"><span className="w-24 shrink-0 capitalize">{k.replace('_', ' ')}</span><div className="h-3 rounded bg-gold" style={{ width: `${(v / max) * 100}%`, minWidth: 4 }} /><span>{v}</span></div>)}</div>; };
const Centered = ({ title, children }) => <div className="min-h-screen grid place-items-center p-4"><div className="clay p-8 w-full max-w-sm grid gap-4"><h1 className="text-2xl text-center">{title}</h1>{children}</div></div>;
function Forgot() {
  const [email, setEmail] = useState(''), [msg, setMsg] = useState('');
  const go = async e => { e.preventDefault(); try { setMsg((await api.post('/auth/forgot', { email })).data.message); } catch (x) { setMsg(errMsg(x)); } };
  return <Centered title="Reset password"><form onSubmit={go} className="grid gap-4"><input type="email" required className="field" placeholder="Email" aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} /><button className="clay-btn">SEND LINK</button></form>{msg && <p role="status" className="text-sm">{msg}</p>}<a href="/admin" className="text-gold underline text-sm text-center">Back to login</a></Centered>;
}
function Reset({ token }) {
  const [p, setP] = useState(''), [msg, setMsg] = useState('');
  const go = async e => { e.preventDefault(); try { setMsg((await api.post('/auth/reset', { token, password: p })).data.message); } catch (x) { setMsg(errMsg(x)); } };
  return <Centered title="Choose a new password"><form onSubmit={go} className="grid gap-4"><input type="password" required minLength={12} autoComplete="new-password" className="field" placeholder="New password (12+ characters)" aria-label="New password" value={p} onChange={e => setP(e.target.value)} /><button className="clay-btn">UPDATE PASSWORD</button></form>{msg && <p role="status" className="text-sm">{msg}</p>}<a href="/admin" className="text-gold underline text-sm text-center">Back to login</a></Centered>;
}
export default function Admin() {
  const m = location.pathname.match(/\/admin\/reset\/([a-f0-9]{64})/);
  return m ? <Reset token={m[1]} /> : location.pathname.startsWith('/admin/forgot') ? <Forgot /> : <Dashboard />;
}
const TABS = ['bookings', 'inquiries', 'artists', 'gallery', 'services', 'blog', 'testimonials', 'faqs', 'settings'];
function Dashboard() {
  const [user, setUser] = useState(undefined), [tab, setTab] = useState('bookings'), [stats, setStats] = useState(null), [chart, setChart] = useState(null);
  useEffect(() => { api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => setUser(null)); }, []);
  useEffect(() => { user && api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}); user && api.get('/admin/chart').then(r => setChart(r.data)).catch(() => {}); }, [user, tab]);
  if (user === undefined) return <p className="p-10 text-muted">Loading…</p>;
  if (!user) return <Login onLogin={setUser} />;
  return (<div className="max-w-6xl mx-auto p-4"><Helmet><title>Admin | Noor Tattoo Studio</title><meta name="robots" content="noindex" /></Helmet>
    <header className="flex items-center justify-between mb-6"><h1 className="text-2xl">Dashboard</h1>
      <button className="clay-btn ghost" onClick={async () => {
        try { await api.post('/auth/logout'); } catch {}
        localStorage.removeItem('noor_auth_token');
        setUser(null);
      }}>Logout</button></header>
    {stats && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{Object.entries(stats).map(([k, v]) => <div key={k} className="clay p-4"><p className="text-3xl text-gold">{v}</p><p className="text-sm text-muted capitalize">{k}</p></div>)}</div>}
    {chart && <div className="grid md:grid-cols-2 gap-4 mb-8"><Bars title="Bookings by status" data={chart.byStatus} /><Bars title="Bookings, last 6 months" data={chart.perMonth} /></div>}
    <div className="flex flex-wrap gap-3 mb-6" role="tablist">{[...TABS, ...(user.role === 'super_admin' ? ['users'] : [])].map(t => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`clay-btn !py-2 !px-4 ${tab === t ? '' : 'ghost'}`}>{t.toUpperCase()}</button>)}</div>
    {tab === 'bookings' || tab === 'inquiries' ? <Table kind={tab} key={tab} /> : tab === 'settings' ? <Settings /> : <Manager kind={tab} key={tab} />}</div>);
}
