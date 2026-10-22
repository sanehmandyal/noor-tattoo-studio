import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.replace(/\/+$/, '');
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
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return u;
  const origin = envUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  return `${origin}${u.startsWith('/') ? '' : '/'}${u}`;
};

export const waLink = (n, t = '') =>
  `https://wa.me/${String(n).replace(/\D/g, '')}${t ? '?text=' + encodeURIComponent(t) : ''}`;
