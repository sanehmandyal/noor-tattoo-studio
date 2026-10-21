import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', withCredentials: true });
export const errMsg = e => e.response?.data?.message || (e.request ? 'Network error. Please try again.' : 'Something went wrong');
export const img = u => (u && u.startsWith('/uploads') ? (import.meta.env.VITE_API_URL || '').replace(/\/api$/, '') + u : u);
export const waLink = (n, t = '') => `https://wa.me/${String(n).replace(/\D/g, '')}${t ? '?text=' + encodeURIComponent(t) : ''}`;
