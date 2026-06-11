import { clearAdminAuth, getAdminToken } from '../admin/adminAuth';
import { getUserToken, clearUserAuth } from './userAuth';

const API_BASE = (import.meta.env.VITE_API_URL || 'https://api.ktexstore.com').replace(/\/$/, '');
export { API_BASE };

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 15000;

export function getImageUrl(image) {
  if (!image) return FALLBACK_IMAGE;
  if (typeof image === 'object' && image !== null) {
    if (image.url) return getImageUrl(image.url);
    return FALLBACK_IMAGE;
  }
  if (typeof image !== 'string') return FALLBACK_IMAGE;
  if (image.startsWith('data:image/')) return image;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/uploads/') || image.startsWith('uploads/')) {
    return `${API_BASE}${image.startsWith('/') ? image : '/' + image}`;
  }
  if (image.startsWith('/') && !image.startsWith('/api/')) return `${API_BASE}${image}`;
  return image;
}

export function getProductImageUrl(product) {
  if (!product) return FALLBACK_IMAGE;
  const images = product.images || [];
  for (const img of images) {
    const url = typeof img === 'string' ? img : (img?.url || '');
    if (url && url !== FALLBACK_IMAGE) return getImageUrl(url);
  }
  return getImageUrl(product.image || '');
}

const requestInterceptors = [];
const responseInterceptors = [];

export function addRequestInterceptor(fn) { requestInterceptors.push(fn); }
export function addResponseInterceptor(fn) { responseInterceptors.push(fn); }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithTimeout(url, options, timeout = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options);
      return res;
    } catch (err) {
      lastError = err;
      const isRetryable = err.name === 'AbortError' || err.message?.includes('fetch') || err.message?.includes('network');
      if (!isRetryable || attempt === retries) break;
      await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
    }
  }
  throw lastError;
}

function handleUnauthorized(authToken) {
  if (!authToken) return;
  if (authToken === getAdminToken()) {
    clearAdminAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login?reason=token_expired';
    }
    return;
  }
  if (authToken === getUserToken()) {
    clearUserAuth();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
      window.location.href = '/login?reason=token_expired';
    }
  }
}

export async function apiRequest(path, { method = 'GET', body, token, headers, auth = true } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const authToken = token ?? (auth ? getUserToken() : '');

  let reqHeaders = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(headers || {}),
  };

  for (const fn of requestInterceptors) {
    const result = fn({ url, method, headers: reqHeaders, body });
    if (result?.headers) reqHeaders = result.headers;
  }

  const res = await fetchWithRetry(url, {
    method,
    headers: reqHeaders,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  for (const fn of responseInterceptors) {
    fn({ url, method, status: res.status, headers: res.headers });
  }

  if (res.status === 401 && authToken) {
    handleUnauthorized(authToken);
    throw new Error('Session expired. Redirecting to login...');
  }

  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!isJson) {
    const err = new Error(`API returned ${res.headers.get('content-type') || 'an unknown content type'} instead of JSON`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  if (!res.ok) {
    const message = typeof data === 'object' && data?.message ? data.message : `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
