import { clearAdminAuth } from '../admin/adminAuth';

const INVALID_TOKEN = 'local-dev-token';

export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  const res = await fetch(path, {
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

