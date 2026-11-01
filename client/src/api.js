import axios from 'axios';

const PROD_API_URL = 'https://noor-tattoo-studio-api.onrender.com';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    const clean = envUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }
  // In development, Vite proxies '/api' to localhost:5000.
  // In production on Vercel, vercel.json rewrites '/api' to Render.
  return '/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 45000 // Generous timeout for server spin-up & cloud queries
});

// Resilient retry interceptor for GET queries during container cold starts (Render/Vercel)
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    if (!config || config.method?.toLowerCase() !== 'get' || config._retryCount >= 2) {
      return Promise.reject(error);
    }
    const status = error.response?.status;
    const isRecoverable = !error.response || [502, 503, 504, 408].includes(status) || error.code === 'ECONNABORTED';
    if (isRecoverable) {
      config._retryCount = (config._retryCount || 0) + 1;
      await new Promise(r => setTimeout(r, config._retryCount * 2500));
      return api(config);
    }
    return Promise.reject(error);
  }
);

// Attach bearer token for cross-origin environments where 3rd-party cookies might be restricted
api.interceptors.request.use(config => {
  try {
    const token = localStorage.getItem('noor_auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export const errMsg = e =>
  e.response?.data?.message ||
  (e.request ? 'Network error. Please try again.' : 'Something went wrong');

export const img = u => {
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
  // If it's an uploaded asset from the backend storage (/uploads/... or /api/media/...)
  if (
    u.startsWith('/uploads/') ||
    u.startsWith('uploads/') ||
    u.startsWith('/api/media/') ||
    u.startsWith('api/media/') ||
    u.startsWith('/media/')
  ) {
    const cleanPath = u.startsWith('/media/') ? `/api${u}` : (u.startsWith('/') ? u : `/${u}`);
    if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) {
      const origin = import.meta.env.VITE_API_URL.trim().replace(/\/api\/?$/, '').replace(/\/+$/, '');
      return `${origin}${cleanPath}`;
    }
    return cleanPath;
  }
  // Static frontend assets (/tattoos/..., /hero-tattoo.jpg, /logo.png, etc.)
  return u;
};

export const waLink = (n, t = '') =>
  `https://wa.me/${String(n).replace(/\D/g, '')}${t ? '?text=' + encodeURIComponent(t) : ''}`;
