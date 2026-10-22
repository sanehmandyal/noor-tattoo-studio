import Manager, { Settings } from './AdminManager.jsx';
import AdminOwnerWorks from './AdminOwnerWorks.jsx';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Image as ImageIcon,
  Sparkles,
  Star,
  FileText,
  HelpCircle,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Globe,
  Menu,
  X,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  Database,
  Phone,
  Mail,
  Feather
} from 'lucide-react';
import { api, errMsg } from '../api.js';

const STATUS = {
  bookings: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
  inquiries: ['new', 'read', 'replied']
};

const STATUS_COLORS = {
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  in_progress: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  completed: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  cancelled: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  new: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  read: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  replied: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
};

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Analytics & studio summary' }
    ]
  },
  {
    title: 'Client Management',
    items: [
      { id: 'bookings', label: 'Appointments', icon: CalendarCheck, desc: 'Tattoo session bookings' },
      { id: 'inquiries', label: 'Client Inquiries', icon: MessageSquare, desc: 'Messages & quote requests' }
    ]
  },
  {
    title: "Founder's Art Studio",
    items: [
      {
        id: 'owner_works',
        label: "Owner's Artworks",
        icon: Feather,
        desc: "Upload Noor's personal tattoo work (picture only)",
        badge: 'Owner'
      }
    ]
  },
  {
    title: 'Studio Content',
    items: [
      { id: 'gallery', label: 'Portfolio Works', icon: ImageIcon, desc: 'Tattoo artwork showcase' },
      { id: 'services', label: 'Services & Pricing', icon: Sparkles, desc: 'Tattoo styles & treatments' },
      { id: 'testimonials', label: 'Honest Reviews', icon: Star, desc: 'Verified client reviews' }
    ]
  },
  {
    title: 'Editorial & Help',
    items: [
      { id: 'blog', label: 'Blog & Articles', icon: FileText, desc: 'Guides & studio articles' },
      { id: 'faqs', label: 'Studio FAQs', icon: HelpCircle, desc: 'Client knowledge base' }
    ]
  },
  {
    title: 'Configuration',
    items: [
      { id: 'settings', label: 'Studio Settings', icon: SettingsIcon, desc: 'Contact, SEO & Social links' }
    ]
  }
];

function Login({ onLogin }) {
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const go = async e => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const res = await api.post('/auth/login', {
        email: f.email.trim(),
        password: f.password
      });
      if (res.data.token) {
        localStorage.setItem('noor_auth_token', res.data.token);
      }
      onLogin(res.data.user);
    } catch (x) {
      setErr(errMsg(x));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-[#020906] relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald/10 rounded-full blur-[100px] pointer-events-none" />

      <form
        onSubmit={go}
        className="glass-card p-8 sm:p-10 w-full max-w-md grid gap-5 border border-gold/30 shadow-2xl relative z-10"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#143526]">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-silver hover:text-gold transition"
          >
            <ArrowLeft size={14} />
            <span>Return to Studio Website</span>
          </a>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/15 text-gold border border-gold/30 uppercase tracking-widest">
            Atelier Secure
          </span>
        </div>

        <div className="text-center space-y-2 pt-2">
          <div className="relative inline-block">
            <img
              src="/logo.png"
              alt="Noor Tattoo Studio"
              width="80"
              height="80"
              className="mx-auto rounded-2xl border border-gold/40 shadow-xl shadow-gold/15 p-1 bg-[#051811]"
            />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald border-2 border-[#051811]" />
          </div>
          <h1 className="text-2xl font-display font-bold text-cream">Noor Atelier Admin</h1>
          <p className="text-xs text-muted">Sign in to manage studio bookings, portfolio & live content</p>
        </div>

        <div className="space-y-4 pt-1">
          <div className="grid gap-1.5 text-xs text-muted font-medium">
            <label className="text-silver font-semibold">Admin Email Address</label>
            <input
              type="email"
              required
              className="field w-full text-xs"
              placeholder="admin@noortattoo.com"
              value={f.email}
              onChange={e => setF({ ...f, email: e.target.value })}
            />
          </div>

          <div className="grid gap-1.5 text-xs text-muted font-medium">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-password" className="text-silver font-semibold">Master Password</label>
              <a href="/admin/forgot" className="text-[11px] text-gold hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="field w-full pr-10 text-xs"
                placeholder="Enter admin password"
                value={f.password}
                onChange={e => setF({ ...f, password: e.target.value })}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition p-1 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {err && (
          <div role="alert" className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-medium flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
            <span>{err}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="clay-btn w-full !py-3 text-xs tracking-wider uppercase font-bold mt-1 shadow-xl flex items-center justify-center gap-2"
        >
          {busy ? (
            <>
              <div className="h-4 w-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              <span>Verifying Credentials…</span>
            </>
          ) : (
            <span>Sign In to Atelier</span>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#143526] text-[11px] text-muted">
          <Database size={12} className="text-emerald" />
          <span>MongoDB Atlas Production Cluster Protected</span>
        </div>
      </form>
    </div>
  );
}

function Table({ kind }) {
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(() => {
    return api
      .get(`/admin/${kind}`, { params: { status, q } })
      .then(r => setRows(r.data.items || []))
      .catch(e => setErr(errMsg(e)));
  }, [kind, status, q]);

  useEffect(() => {
    setRows(null);
    load();
  }, [load]);

  const patch = async (id, body) => {
    setSavingId(id);
    try {
      await api.patch(`/admin/${kind}/${id}`, body);
      load();
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setSavingId(null);
    }
  };

  const del = async id => {
    if (confirm('Permanently delete this client record?')) {
      try {
        await api.delete(`/admin/${kind}/${id}`);
        load();
      } catch (e) {
        setErr(errMsg(e));
      }
    }
  };

  const isBookings = kind === 'bookings';

  return (
    <div className="space-y-5">
      {/* Search & Status Filters */}
      <div className="glass-card p-4 border border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="field w-full pl-9 text-xs"
              placeholder="Search by client name, email, phone…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-cream"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gold shrink-0" />
            <select
              className="field text-xs !py-2"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS[kind].map(s => (
                <option key={s} value={s}>
                  {s.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={load}
          className="clay-btn ghost text-xs !py-2 !px-3 inline-flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
          title="Refresh records"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {err && (
        <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-950/40 text-red-300 text-xs font-semibold">
          {err}
        </div>
      )}

      {/* Table Data */}
      {!rows ? (
        <div className="glass-card p-12 text-center text-muted text-sm border border-gold/15 flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span>Loading client {kind} from database…</span>
        </div>
      ) : !rows.length ? (
        <div className="glass-card p-12 text-center text-muted text-sm border border-gold/15 space-y-2">
          <p className="text-cream font-medium">No records found</p>
          <p className="text-xs text-muted">
            {q || status ? 'Try clearing your search filters above.' : `New incoming ${kind} will appear here.`}
          </p>
        </div>
      ) : (
        <div className="glass-card border border-gold/15 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-left text-muted bg-[#051811] border-b border-[#17382a]">
                <tr>
                  <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Client Details</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">
                    {isBookings ? 'Session & Concept' : 'Inquiry Message'}
                  </th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Studio Notes</th>
                  <th className="p-4 text-right font-semibold uppercase tracking-wider text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#17382a]">
                {rows.map(r => (
                  <tr key={r._id} className="align-top hover:bg-emerald/5 transition">
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-cream text-sm">{r.name}</div>
                      {r.phone && (
                        <a
                          href={`tel:${r.phone}`}
                          className="inline-flex items-center gap-1 text-gold/90 hover:underline mt-0.5 text-xs font-medium"
                        >
                          <Phone size={11} />
                          <span>{r.phone}</span>
                        </a>
                      )}
                      <div className="text-muted text-[11px] flex items-center gap-1 mt-0.5">
                        <Mail size={11} />
                        <a href={`mailto:${r.email}`} className="hover:text-cream truncate max-w-[180px]">
                          {r.email}
                        </a>
                      </div>
                      <div className="text-[10px] text-muted/70 mt-1">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                      </div>
                    </td>

                    <td className="p-4 max-w-sm">
                      {isBookings ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-emerald text-xs flex items-center gap-1">
                              <Clock size={12} />
                              <span>{r.date} at {r.time}</span>
                            </span>
                          </div>
                          <div className="text-silver font-medium text-xs">
                            <span className="text-gold font-bold">Style:</span> {r.style || 'Custom'} · <span className="text-gold font-bold">Placement:</span> {r.placement || 'Studio Choice'}
                          </div>
                          {r.description && (
                            <p className="text-muted text-xs leading-relaxed bg-[#03110b] p-2 rounded-lg border border-[#143526] mt-1.5">
                              {r.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {r.subject && <div className="font-semibold text-cream text-xs">{r.subject}</div>}
                          <p className="text-muted text-xs leading-relaxed bg-[#03110b] p-2 rounded-lg border border-[#143526]">
                            {r.message}
                          </p>
                        </div>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="space-y-1.5">
                        <select
                          className={`field !py-1 !text-xs font-semibold rounded-lg border uppercase tracking-wider ${
                            STATUS_COLORS[r.status] || 'bg-[#03110b] text-silver border-[#143526]'
                          }`}
                          value={r.status}
                          disabled={savingId === r._id}
                          onChange={e => patch(r._id, { status: e.target.value })}
                        >
                          {STATUS[kind].map(s => (
                            <option key={s} value={s} className="bg-[#04120c] text-cream">
                              {s.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>
                        {savingId === r._id && (
                          <span className="text-[10px] text-gold block">Updating…</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <input
                        className="field !py-1 !text-xs w-full min-w-[14rem] bg-[#020d08]"
                        defaultValue={r.notes || ''}
                        placeholder="Private studio note (auto-saves on blur)…"
                        onBlur={e => {
                          if (e.target.value !== (r.notes || '')) {
                            patch(r._id, { notes: e.target.value });
                          }
                        }}
                      />
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => del(r._id)}
                        className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold p-1 hover:bg-red-500/10 rounded transition"
                        title="Delete permanently"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const Bars = ({ title, data }) => {
  const max = Math.max(1, ...data.map(d => d[1]));
  return (
    <div className="glass-card p-6 border border-gold/15">
      <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-5 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-gold font-normal text-[11px]">Live Metric</span>
      </h3>
      {!data.length ? (
        <p className="text-muted text-xs">No metrics recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map(([k, v]) => (
            <div key={k} className="flex items-center gap-3 text-xs">
              <span className="w-28 shrink-0 capitalize text-silver font-medium truncate">
                {k.replace('_', ' ')}
              </span>
              <div className="flex-1 bg-[#03110b] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#143526]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald via-gold to-gold transition-all duration-700"
                  style={{ width: `${(v / max) * 100}%`, minWidth: 8 }}
                />
              </div>
              <span className="w-8 text-right font-bold text-cream">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Centered = ({ title, children }) => (
  <div className="min-h-screen grid place-items-center p-4 bg-[#020906]">
    <div className="glass-card p-8 w-full max-w-md grid gap-4 border border-gold/30 shadow-2xl">
      <h1 className="text-2xl text-center font-display font-bold text-cream">{title}</h1>
      {children}
    </div>
  </div>
);

function Forgot() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async e => {
    e.preventDefault();
    setBusy(true);
    try {
      setMsg((await api.post('/auth/forgot', { email })).data.message);
    } catch (x) {
      setMsg(errMsg(x));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Centered title="Reset Password">
      <p className="text-xs text-muted text-center -mt-2">
        Enter your admin email to receive a secure password reset link.
      </p>
      <form onSubmit={go} className="grid gap-4 mt-2">
        <input
          type="email"
          required
          className="field text-xs"
          placeholder="admin@noortattoo.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button disabled={busy} className="clay-btn text-xs !py-3">
          {busy ? 'SENDING RESET LINK…' : 'SEND RESET LINK'}
        </button>
      </form>
      {msg && <p role="status" className="text-xs text-emerald font-medium text-center">{msg}</p>}
      <a href="/admin" className="text-gold hover:underline text-xs text-center mt-2">
        ← Back to Admin Login
      </a>
    </Centered>
  );
}

function Reset({ token }) {
  const [p, setP] = useState('');
  const [msg, setMsg] = useState('');
  const [showP, setShowP] = useState(false);
  const [busy, setBusy] = useState(false);

  const go = async e => {
    e.preventDefault();
    setBusy(true);
    try {
      setMsg((await api.post('/auth/reset', { token, password: p })).data.message);
    } catch (x) {
      setMsg(errMsg(x));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Centered title="Set New Password">
      <p className="text-xs text-muted text-center -mt-2">Enter your new secure password (12+ characters).</p>
      <form onSubmit={go} className="grid gap-4 mt-2">
        <div className="relative">
          <input
            type={showP ? 'text' : 'password'}
            required
            minLength={12}
            autoComplete="new-password"
            className="field w-full pr-10 text-xs"
            placeholder="New master password"
            value={p}
            onChange={e => setP(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowP(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition p-1"
          >
            {showP ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button disabled={busy} className="clay-btn text-xs !py-3">
          {busy ? 'SAVING NEW PASSWORD…' : 'SAVE MASTER PASSWORD'}
        </button>
      </form>
      {msg && <p role="status" className="text-xs text-emerald font-medium text-center">{msg}</p>}
      <a href="/admin" className="text-gold hover:underline text-xs text-center mt-2">
        ← Back to Admin Login
      </a>
    </Centered>
  );
}

export default function Admin() {
  const m = location.pathname.match(/\/admin\/reset\/([a-f0-9]{64})/);
  return m ? <Reset token={m[1]} /> : location.pathname.startsWith('/admin/forgot') ? <Forgot /> : <Dashboard />;
}

function Dashboard() {
  const [user, setUser] = useState(undefined);
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    api
      .get('/auth/me')
      .then(r => setUser(r.data.user))
      .catch(() => setUser(null));
  }, []);

  const refreshMetrics = useCallback(() => {
    if (!user) return;
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/admin/chart').then(r => setChart(r.data)).catch(() => {});
  }, [user]);

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics, tab]);

  if (user === undefined) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#020906] text-gold p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-widest text-muted font-semibold">
            Connecting to Studio Atelier…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('noor_auth_token');
    setUser(null);
  };

  // Find active nav item label and desc
  const activeItem = NAV_GROUPS.flatMap(g => g.items).find(i => i.id === tab) || {
    label: 'Dashboard',
    desc: 'Studio overview'
  };

  return (
    <div className="min-h-screen bg-[#020a06] text-cream flex">
      <Helmet>
        <title>Studio Admin Control Center | Noor Tattooz Studio</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ========================================================= */}
      {/* PROFESSIONAL SIDEBAR (DESKTOP FIXED + MOBILE SLIDE-OVER) */}
      {/* ========================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#030e09] border-r border-[#143526] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Studio Brand Header */}
        <div>
          <div className="p-5 border-b border-[#143526] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Noor Tattoo Studio"
                width="40"
                height="40"
                className="rounded-xl border border-gold/40 shadow-md bg-[#051811] p-0.5"
              />
              <div>
                <h2 className="font-display font-bold text-cream text-base tracking-wide leading-tight">
                  NOOR ATELIER
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
                  <span className="text-[10px] font-semibold text-emerald uppercase tracking-wider">
                    MongoDB Atlas
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden h-8 w-8 rounded-lg grid place-items-center text-muted hover:text-cream bg-[#082015] border border-[#143526]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Sidebar Nav Links */}
          <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)] custom-scroll">
            {NAV_GROUPS.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted/70 mb-1.5">
                  {group.title}
                </div>
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTab(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-gold/25 to-emerald/20 border border-gold/40 text-cream shadow-md shadow-gold/10'
                          : 'text-silver/80 hover:text-cream hover:bg-[#071f15] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          size={16}
                          className={`shrink-0 transition-colors ${
                            isActive ? 'text-gold' : 'text-muted group-hover:text-gold'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-sm shadow-gold" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Card & Website Access */}
        <div className="p-3 border-t border-[#143526] bg-[#020b07] space-y-2">
          {/* Quick link back to public site */}
          <a
            href="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-silver hover:text-gold bg-[#061811] hover:bg-[#0b281c] border border-[#143526] hover:border-gold/30 transition shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Globe size={13} className="text-gold" />
              <span>Return to Public Site</span>
            </div>
            <ExternalLink size={12} className="text-muted" />
          </a>

          {/* User info card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#04140e] border border-[#143526]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-gold/20 border border-gold/40 grid place-items-center text-xs font-bold text-gold shrink-0">
                {(user.name || user.email || 'N').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-cream truncate">
                  {user.name || 'Noor (Founder)'}
                </div>
                <div className="text-[10px] text-muted truncate">
                  {user.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <main className="flex-1 md:pl-72 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#030e09]/90 backdrop-blur-md border-b border-[#143526] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden h-9 w-9 rounded-xl grid place-items-center text-silver hover:text-cream bg-[#061811] border border-[#143526]"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted font-medium hidden sm:inline">Admin Panel /</span>
                <h1 className="text-base md:text-lg font-display font-bold text-cream leading-tight">
                  {activeItem.label}
                </h1>
              </div>
              <p className="text-[11px] text-muted hidden sm:block">
                {activeItem.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn ghost text-xs !py-1.5 !px-3 inline-flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">VIEW LIVE SITE</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={handleLogout}
              className="clay-btn ghost text-xs !py-1.5 !px-3 text-red-400 hover:border-red-400/40 inline-flex items-center gap-1.5"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="p-4 md:p-8 space-y-8 flex-1">
          {tab === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Studio Banner */}
              <div className="glass-card p-6 md:p-8 border border-gold/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-gold/15 to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald/15 text-emerald border border-emerald/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-ping" />
                    Studio Active & Connected
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-cream">
                    Welcome to Noor Atelier Dashboard
                  </h2>
                  <p className="text-xs md:text-sm text-silver/80 leading-relaxed">
                    Manage your client bookings, incoming quote inquiries, portfolio artworks, and studio configuration. All changes are saved live into production MongoDB.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <button
                      onClick={() => setTab('owner_works')}
                      className="clay-btn text-xs !py-2 !px-4 inline-flex items-center gap-2 border border-gold/40 shadow-lg"
                    >
                      <Feather size={14} className="text-gold" />
                      <span>Upload Owner's Tattoo</span>
                    </button>
                    <button
                      onClick={() => setTab('bookings')}
                      className="clay-btn ghost text-xs !py-2 !px-4 inline-flex items-center gap-2"
                    >
                      <CalendarCheck size={14} />
                      <span>Review Bookings</span>
                    </button>
                    <button
                      onClick={() => setTab('gallery')}
                      className="clay-btn ghost text-xs !py-2 !px-4 inline-flex items-center gap-2"
                    >
                      <Plus size={14} />
                      <span>Studio Gallery</span>
                    </button>
                    <button
                      onClick={() => setTab('settings')}
                      className="clay-btn ghost text-xs !py-2 !px-4 inline-flex items-center gap-2"
                    >
                      <SettingsIcon size={14} />
                      <span>Studio Settings</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Stat Cards */}
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(stats).map(([k, v]) => (
                    <div
                      key={k}
                      className="glass-card p-5 border border-gold/15 hover:border-gold/40 transition relative overflow-hidden group"
                    >
                      <div className="absolute -top-3 -right-3 w-14 h-14 bg-gold/10 rounded-full group-hover:scale-125 transition duration-500" />
                      <p className="text-3xl md:text-4xl font-display font-bold text-gold tracking-tight">
                        {v}
                      </p>
                      <p className="text-xs text-muted font-semibold uppercase tracking-wider mt-1.5">
                        {k.replace(/([A-Z])/g, ' $1')}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Charts Section */}
              {chart && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Bars title="Bookings by Status" data={chart.byStatus || []} />
                  <Bars title="Bookings (Last 6 Months)" data={chart.perMonth || []} />
                </div>
              )}

              {/* Quick Actions Shortcuts */}
              <div className="glass-card p-6 border border-gold/15">
                <h3 className="text-sm font-bold text-cream uppercase tracking-wider mb-4">
                  Studio Management Shortcuts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Owner's Artworks",
                      desc: "Quick upload Noor's tattoo photos",
                      tab: 'owner_works',
                      icon: Feather
                    },
                    {
                      label: 'Appointments',
                      desc: 'Check upcoming tattoo sessions',
                      tab: 'bookings',
                      icon: CalendarCheck
                    },
                    {
                      label: 'Client Inquiries',
                      desc: 'Answer client questions & quotes',
                      tab: 'inquiries',
                      icon: MessageSquare
                    },
                    {
                      label: 'Portfolio Showcase',
                      desc: 'Manage all resident artworks',
                      tab: 'gallery',
                      icon: ImageIcon
                    },
                    {
                      label: 'Reviews & Feedback',
                      desc: 'Manage Google verified ratings',
                      tab: 'testimonials',
                      icon: Star
                    }
                  ].map((sc, idx) => {
                    const ScIcon = sc.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => setTab(sc.tab)}
                        className="p-4 rounded-xl bg-[#04130d] hover:bg-[#09251a] border border-[#143526] hover:border-gold/30 text-left transition space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <ScIcon size={18} className="text-gold group-hover:scale-110 transition" />
                          <ChevronRight size={14} className="text-muted group-hover:text-cream transition" />
                        </div>
                        <div className="font-semibold text-cream text-xs pt-1">{sc.label}</div>
                        <div className="text-[11px] text-muted">{sc.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Owner Tattoo Artworks (Picture-only Quick Uploader) */}
          {tab === 'owner_works' && <AdminOwnerWorks />}

          {/* Bookings or Inquiries */}
          {(tab === 'bookings' || tab === 'inquiries') && (
            <Table kind={tab} key={tab} />
          )}

          {/* Studio Settings */}
          {tab === 'settings' && <Settings />}

          {/* Dynamic Content Managers */}
          {['gallery', 'services', 'testimonials', 'blog', 'faqs'].includes(tab) && (
            <Manager kind={tab} key={tab} />
          )}
        </div>
      </main>
    </div>
  );
}
