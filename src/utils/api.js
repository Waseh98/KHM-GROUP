import { clearAdminAuth } from '../admin/adminAuth';

const API_BASE = 'https://khm-group-production.up.railway.app';
export { API_BASE };

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80';

export function getImageUrl(image) {
  if (!image) return FALLBACK_IMAGE;
  if (typeof image === 'object' && image !== null) {
    if (image.url) return getImageUrl(image.url);
    return FALLBACK_IMAGE;
  }
  if (typeof image !== 'string') return FALLBACK_IMAGE;
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

const INVALID_TOKEN = 'local-dev-token';

export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401 && token === INVALID_TOKEN) {
    clearAdminAuth();
    window.location.href = '/admin/login?reason=token_expired';
    throw new Error('Session expired. Redirecting to login...');
  }

  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === 'object' && data?.message ? data.message : `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}