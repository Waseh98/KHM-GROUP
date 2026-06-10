/**
 * Admin panel session (ktex_admin_token / ktex_admin_user).
 * Intentionally separate from customer auth in userAuth.js — admins may sign in
 * while a customer session exists, and admin routes require role === 'admin'.
 */
const TOKEN_KEY = 'ktex_admin_token';
const USER_KEY = 'ktex_admin_user';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminAuth({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAdminAuthed() {
  const token = getAdminToken();
  const user = getAdminUser();
  return Boolean(token && user && user.role === 'admin');
}

export function validateAdminToken() {
  const token = getAdminToken();
  if (!token) {
    clearAdminAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login?reason=token_expired';
    }
    return false;
  }
  return true;
}

