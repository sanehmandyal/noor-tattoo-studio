import Manager, { Settings } from './AdminManager.jsx';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { api, errMsg } from '../api.js';

const STATUS = {
  bookings: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
  inquiries: ['new', 'read', 'replied']
};

function Login({ onLogin }) {
  const [f, setF] = useState({ email: '', password: '' }), [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={go} className="glass-card p-8 w-full max-w-sm grid gap-4 border border-gold/30 shadow-2xl">
        <div className="flex justify-start">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-silver hover:text-gold transition">
            <span>← Return to Studio Website</span>
          </a>
        </div>
        <img src="/logo.png" alt="Noor Tattoo Studio" width="84" height="84" className="mx-auto rounded-full border border-gold/40 shadow-lg shadow-gold/10" />
        <h1 className="text-2xl text-center font-display font-bold text-cream">Admin Control Panel</h1>
        <p className="text-xs text-muted text-center -mt-2">Sign in to manage studio bookings, gallery & content</p>
        <label className="grid gap-1 text-xs text-muted font-medium">Email Address
          <input type="email" required className="field" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
        </label>
        <div className="grid gap-1 text-xs text-muted font-medium">
          <label htmlFor="admin-password">Password</label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              required
              className="field w-full pr-10"
              value={f.password}
              onChange={e => setF({ ...f, password: e.target.value })}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition p-1 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        {err && <p role="alert" className="text-[var(--error)] text-xs">{err}</p>}
        <button className="clay-btn w-full mt-2">SIGN IN TO STUDIO PANEL</button>
        <div className="flex items-center justify-between text-xs pt-1">
          <a href="/admin/forgot" className="text-gold underline">Forgot password?</a>
          <a href="/" className="text-silver hover:underline">Back to site</a>
        </div>
      </form>
    </div>
  );
}

function Table({ kind }) {
  const [rows, setRows] = useState(null), [status, setStatus] = useState(''), [q, setQ] = useState(''), [err, setErr] = useState('');
  const load = useCallback(() => api.get(`/admin/${kind}`, { params: { status, q } }).then(r => setRows(r.data.items)).catch(e => setErr(errMsg(e))), [kind, status, q]);
  useEffect(() => { setRows(null); load(); }, [load]);
  const patch = async (id, body) => { try { await api.patch(`/admin/${kind}/${id}`, body); load(); } catch (e) { setErr(errMsg(e)); } };
  const del = async id => { if (confirm('Delete permanently?')) { try { await api.delete(`/admin/${kind}/${id}`); load(); } catch (e) { setErr(errMsg(e)); } } };
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input className="field max-w-xs text-xs" placeholder="Search name/email" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
        <select className="field max-w-[12rem] text-xs" value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUS[kind].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {err && <p role="alert" className="text-[var(--error)] mb-3 text-xs">{err}</p>}
      {!rows ? <p className="text-muted text-sm">Loading records from database…</p> : !rows.length ? <p className="text-muted text-sm">No records found.</p> :
        <div className="overflow-x-auto glass-card border border-gold/15">
          <table className="w-full text-xs">
            <thead className="text-left text-muted bg-[#051811] border-b border-[#17382a]">
              <tr>
                <th className="p-3.5 font-semibold">Client</th>
                <th className="p-3.5 font-semibold">Details & Message</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Internal Notes</th>
                <th className="p-3.5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17382a]">
              {rows.map(r => (
                <tr key={r._id} className="align-top hover:bg-emerald/5 transition">
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-semibold text-cream text-sm">{r.name}</span>
                    <br />
                    <span className="text-gold/90">{r.phone || ''}</span>
                    <br />
                    <span className="text-muted">{r.email}</span>
                  </td>
                  <td className="p-3.5 max-w-sm">
                    {kind === 'bookings' ? (
                      <div>
                        <span className="font-medium text-emerald">{r.date} at {r.time}</span>
                        <div className="text-silver font-medium mt-0.5">{r.style} · {r.placement}</div>
                      </div>
                    ) : (
                      <span className="font-medium text-silver">{r.subject}</span>
                    )}
                    <p className="text-muted text-[11px] mt-1 leading-relaxed">{r.description || r.message}</p>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <select
                      className="field !py-1 !text-xs"
                      value={r.status}
                      onChange={e => patch(r._id, { status: e.target.value })}
                      aria-label="Status"
                    >
                      {STATUS[kind].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3.5">
                    <input
                      className="field !py-1 !text-xs w-full min-w-[12rem]"
                      defaultValue={r.notes || ''}
                      placeholder="Add private studio note…"
                      onBlur={e => e.target.value !== (r.notes || '') && patch(r._id, { notes: e.target.value })}
                      aria-label="Internal notes"
                    />
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <button onClick={() => del(r._id)} className="text-[var(--error)] hover:underline font-semibold">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}

const Bars = ({ title, data }) => {
  const max = Math.max(1, ...data.map(d => d[1]));
  return (
    <div className="glass-card p-5">
      <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">{title}</h2>
      {!data.length ? (
        <p className="text-muted text-xs">No metrics recorded yet.</p>
      ) : (
        data.map(([k, v]) => (
          <div key={k} className="flex items-center gap-2 text-xs mb-2.5">
            <span className="w-24 shrink-0 capitalize text-silver">{k.replace('_', ' ')}</span>
            <div className="flex-1 bg-[#051811] h-3.5 rounded-full overflow-hidden p-0.5 border border-line">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald via-gold to-gold transition-all duration-500"
                style={{ width: `${(v / max) * 100}%`, minWidth: 6 }}
              />
            </div>
            <span className="w-8 text-right font-semibold text-cream">{v}</span>
          </div>
        ))
      )}
    </div>
  );
};

const Centered = ({ title, children }) => (
  <div className="min-h-screen grid place-items-center p-4">
    <div className="glass-card p-8 w-full max-w-sm grid gap-4 border border-gold/30">
      <h1 className="text-2xl text-center font-display font-bold text-cream">{title}</h1>
      {children}
    </div>
  </div>
);

function Forgot() {
  const [email, setEmail] = useState(''), [msg, setMsg] = useState('');
  const go = async e => {
    e.preventDefault();
    try {
      setMsg((await api.post('/auth/forgot', { email })).data.message);
    } catch (x) {
      setMsg(errMsg(x));
    }
  };
  return (
    <Centered title="Reset Password">
      <form onSubmit={go} className="grid gap-4">
        <input type="email" required className="field" placeholder="Admin Email" aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="clay-btn">SEND PASSWORD RESET LINK</button>
      </form>
      {msg && <p role="status" className="text-xs text-emerald">{msg}</p>}
      <a href="/admin" className="text-gold underline text-xs text-center">Back to Admin Login</a>
    </Centered>
  );
}

function Reset({ token }) {
  const [p, setP] = useState(''), [msg, setMsg] = useState('');
  const [showP, setShowP] = useState(false);
  const go = async e => {
    e.preventDefault();
    try {
      setMsg((await api.post('/auth/reset', { token, password: p })).data.message);
    } catch (x) {
      setMsg(errMsg(x));
    }
  };
  return (
    <Centered title="Set New Password">
      <form onSubmit={go} className="grid gap-4">
        <div className="relative">
          <input
            type={showP ? 'text' : 'password'}
            required
            minLength={12}
            autoComplete="new-password"
            className="field w-full pr-10"
            placeholder="New password (12+ characters)"
            aria-label="New password"
            value={p}
            onChange={e => setP(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowP(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition p-1 focus:outline-none"
            aria-label={showP ? 'Hide password' : 'Show password'}
            title={showP ? 'Hide password' : 'Show password'}
          >
            {showP ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button className="clay-btn">SAVE NEW PASSWORD</button>
      </form>
      {msg && <p role="status" className="text-xs text-emerald">{msg}</p>}
      <a href="/admin" className="text-gold underline text-xs text-center">Back to Admin Login</a>
    </Centered>
  );
}

export default function Admin() {
  const m = location.pathname.match(/\/admin\/reset\/([a-f0-9]{64})/);
  return m ? <Reset token={m[1]} /> : location.pathname.startsWith('/admin/forgot') ? <Forgot /> : <Dashboard />;
}

const TABS = [
  { id: 'bookings', label: 'Bookings' },
  { id: 'inquiries', label: 'Inquiries' },
  { id: 'gallery', label: 'Portfolio Works' },
  { id: 'services', label: 'Services & Pricing' },
  { id: 'testimonials', label: 'Honest Reviews' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'blog', label: 'Blog Articles' },
  { id: 'settings', label: 'Studio Settings' }
];

function Dashboard() {
  const [user, setUser] = useState(undefined), [tab, setTab] = useState('bookings'), [stats, setStats] = useState(null), [chart, setChart] = useState(null);
  
  useEffect(() => {
    api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => setUser(null));
  }, []);

  const refreshMetrics = useCallback(() => {
    if (!user) return;
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/admin/chart').then(r => setChart(r.data)).catch(() => {});
  }, [user]);

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics, tab]);

  if (user === undefined) return <p className="p-10 text-muted">Checking admin authentication…</p>;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <Helmet>
        <title>Studio Admin Control Panel | Noor Tattoo Studio</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Return to Public Website Access Bar */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#143526]">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-cream bg-[#082217] hover:bg-[#0e3525] border border-gold/30 hover:border-gold px-3.5 py-2 rounded-xl transition shadow-sm"
        >
          <span>← Return to Public Website</span>
        </a>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-silver hover:text-gold transition inline-flex items-center gap-1.5"
        >
          <span>Open Site in New Tab</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* Admin Top Glass Header */}
      <header className="glass-card p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gold/25">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-display font-bold text-cream">Noor Studio Owner Admin</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald/15 text-emerald border border-emerald/30">
              <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
              Live MongoDB Connected
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Logged in as <strong className="text-silver">{user.name || user.email}</strong>. Every update directly synchronizes with the live website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="clay-btn ghost text-xs inline-flex items-center gap-1.5 !py-2.5 !px-4"
          >
            <span>VIEW LIVE SITE</span>
            <span aria-hidden="true">↗</span>
          </a>
          <button
            className="clay-btn ghost text-xs !py-2.5 !px-3 text-[var(--error)] hover:border-[var(--error)]/50"
            onClick={async () => {
              try { await api.post('/auth/logout'); } catch {}
              localStorage.removeItem('noor_auth_token');
              setUser(null);
            }}
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Overview Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="glass-card p-5 relative overflow-hidden group hover:border-gold/40 transition">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-3xl pointer-events-none" />
              <p className="text-3xl font-display font-bold text-gold">{v}</p>
              <p className="text-xs text-muted font-medium uppercase tracking-wider mt-1">{k.replace(/([A-Z])/g, ' $1')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {chart && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Bars title="Bookings by Status" data={chart.byStatus} />
          <Bars title="Bookings (Last 6 Months)" data={chart.perMonth} />
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`glass-pill !py-2 !px-4 text-xs uppercase tracking-wider font-semibold transition ${
              tab === t.id
                ? '!bg-gradient-to-r !from-gold/30 !to-emerald/30 !border-gold !text-cream shadow-md shadow-gold/10'
                : 'text-silver hover:text-cream hover:border-gold/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[300px]">
        {tab === 'bookings' || tab === 'inquiries' ? (
          <Table kind={tab} key={tab} />
        ) : tab === 'settings' ? (
          <Settings />
        ) : (
          <Manager kind={tab} key={tab} />
        )}
      </div>
    </div>
  );
}
