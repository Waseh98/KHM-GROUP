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

