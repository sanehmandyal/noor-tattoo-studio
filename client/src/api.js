import axios from 'axios';

const PROD_API_URL = 'https://noor-tattoo-studio-api.onrender.com';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PROD_API_URL : '/api');
  const clean = (envUrl || PROD_API_URL).replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true
});

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
  // If it's an uploaded asset from the backend storage (/uploads/...)
  if (u.startsWith('/uploads/') || u.startsWith('uploads/')) {
    const envUrl = import.meta.env.VITE_API_URL || PROD_API_URL;
    const origin = envUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    return `${origin}${u.startsWith('/') ? '' : '/'}${u}`;
  }
  // Static frontend assets (/tattoos/..., /hero-tattoo.jpg, /logo.png, etc.)
  return u;
};

export const waLink = (n, t = '') =>
  `https://wa.me/${String(n).replace(/\D/g, '')}${t ? '?text=' + encodeURIComponent(t) : ''}`;
