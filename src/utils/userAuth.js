/**
 * Storefront customer session (ktex_token / ktex_user).
 * Firebase is used only as an identity provider — every customer gets a backend JWT
 * stored here so API calls share one auth model. Admin sessions live in adminAuth.js.
 */
const TOKEN_KEY = 'ktex_token';
const USER_KEY = 'ktex_user';

export function getUserToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUserAuth({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUserAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function normalizeBackendUser(user) {
  return {
    id: user._id || user.id,
    email: user.email,
    role: user.role || 'user',
    authProvider: 'backend',
    created_at: user.createdAt,
    user_metadata: {
      full_name: user.name || 'Member',
      avatar_url: user.avatar?.url || '',
    },
  };
}

export function normalizeFirebaseUser(fbUser) {
  return {
    id: fbUser.uid,
    email: fbUser.email,
    role: 'user',
    authProvider: 'firebase',
    created_at: fbUser.metadata?.creationTime,
    user_metadata: {
      full_name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
      avatar_url: fbUser.photoURL || '',
    },
  };
}
