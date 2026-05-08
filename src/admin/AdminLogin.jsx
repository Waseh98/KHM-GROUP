import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { setAdminAuth } from './adminAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('abdulwasay@khm.ae');
  const [password, setPassword] = useState('Wasay123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => Boolean(email.trim() && password), [email, password]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email: email.trim(), password },
      });

      if (!data?.token || !data?.user) throw new Error('Login response missing token');
      if (data.user.role !== 'admin') throw new Error('This account is not admin');

      setAdminAuth({ token: data.token, user: data.user });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      // ── Offline / gateway error → use local credentials bypass ──
      const raw = (err.message || '').toLowerCase();
      const isOffline =
        raw.includes('502') || raw.includes('503') || raw.includes('504') ||
        raw.includes('failed to fetch') || raw.includes('networkerror') ||
        raw.includes('load failed') || raw.includes('net::') ||
        err.name === 'AbortError';

      if (isOffline) {
        // Hardcoded local admin credentials
        const LOCAL_EMAIL    = 'abdulwasay@khm.ae';
        const LOCAL_PASSWORD = 'Wasay123';

        if (email.trim() === LOCAL_EMAIL && password === LOCAL_PASSWORD) {
          setAdminAuth({
            token: 'local-dev-token',
            user: { _id: 'local', name: 'Admin (Local)', email: LOCAL_EMAIL, role: 'admin' },
          });
          navigate('/admin/dashboard', { replace: true });
          return;
        } else {
          setError('Incorrect email or password.');
        }
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <main style={{ minHeight: '100vh', padding: '80px 20px', backgroundColor: '#0d0d0d' }}>
      <div
        className="container"
        style={{
          maxWidth: '520px',
          backgroundColor: 'var(--white)',
          padding: '42px',
          borderRadius: '14px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: '2.6rem', marginBottom: 10 }}>🔐</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0 }}>
            Admin Login
          </h1>
          <p style={{ color: 'var(--mid-gray)', marginTop: 6 }}>Sign in to manage orders & website.</p>
        </div>

        {error && (
          <div
            style={{
              border: '1px solid #f2b8b5',
              background: '#fdecea',
              color: '#611a15',
              padding: '10px 12px',
              borderRadius: 10,
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="username"
              placeholder="admin@khm.ae"
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: 'var(--gold)',
              color: 'var(--white)',
              fontSize: 14,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderRadius: 10,
              opacity: !canSubmit || loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

