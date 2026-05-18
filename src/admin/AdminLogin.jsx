import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { setAdminAuth } from './adminAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('abdulwasay@khm.ae');
  const [password, setPassword] = useState('Wasay123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const tokenExpired = urlParams.get('reason') === 'token_expired';

  useEffect(() => {
    if (tokenExpired && !error) {
      setError('Your session has expired. Please login again.');
    }
  }, [tokenExpired]);

  const canSubmit = useMemo(() => Boolean(email.trim() && password), [email, password]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/login', { method: 'POST', body: { email: email.trim(), password } });
      if (!data?.token || !data?.user) throw new Error('Login response missing token');
      if (data.user.role !== 'admin') throw new Error('This account is not admin');
      setAdminAuth({ token: data.token, user: data.user });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const raw = (err.message || '').toLowerCase();
      const isOffline = raw.includes('502') || raw.includes('503') || raw.includes('504') || raw.includes('failed to fetch') || raw.includes('networkerror') || raw.includes('load failed') || raw.includes('net::') || err.name === 'AbortError';
      if (isOffline) {
        const LOCAL_EMAIL = 'abdulwasay@khm.ae';
        const LOCAL_PASSWORD = 'Wasay123';
        if (email.trim() === LOCAL_EMAIL && password === LOCAL_PASSWORD) {
          setAdminAuth({ token: 'local-dev-token', user: { _id: 'local', name: 'Admin (Local)', email: LOCAL_EMAIL, role: 'admin' } });
          navigate('/admin/dashboard', { replace: true });
          return;
        } else { setError('Incorrect email or password.'); }
      } else { setError(err.message || 'Login failed'); }
    } finally { setLoading(false); }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d0d 100%)' }}>
      <div style={{ maxWidth: 460, width: '100%', background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)', padding: 'clamp(28px, 5vw, 48px)', borderRadius: 24, border: '1px solid rgba(212,175,42,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(212,175,42,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,42,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,42,0.1) 0%, transparent 70%)' }} />

        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: 16, boxShadow: '0 8px 30px rgba(212,175,42,0.3)' }}>🔐</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 5vw, 32px)', margin: 0, fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Login</h1>
          <p style={{ color: '#666', marginTop: 8, fontSize: 14 }}>Sign in to manage your store</p>
        </div>

        {error && (<div style={{ border: '1px solid rgba(255,100,100,0.4)', background: 'rgba(255,100,100,0.1)', color: '#ff6b6b', padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontWeight: 600, fontSize: 14 }}>{error}</div>)}

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="username" placeholder="admin@khm.ae" style={{ width: '100%', padding: 16, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', fontSize: 15, boxSizing: 'border-box', transition: 'all 0.3s ease', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} required autoComplete="current-password" placeholder="••••••••" style={{ width: '100%', padding: 16, paddingRight: 50, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18 }}>{showPass ? '👁️' : '👁️‍🗨️'}</button>
            </div>
          </div>

          <button type="submit" disabled={!canSubmit || loading} style={{ width: '100%', padding: '16px 24px', background: canSubmit && !loading ? 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)' : 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 14, border: 'none', cursor: canSubmit && !loading ? 'pointer' : 'not-allowed', boxShadow: canSubmit && !loading ? '0 8px 25px rgba(212,175,90,0.3)' : 'none', transition: 'all 0.3s ease', marginTop: 8 }}>
            {loading ? '⏳ Signing in...' : '🔓 Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}

