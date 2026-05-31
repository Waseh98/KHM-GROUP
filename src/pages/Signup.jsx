import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Signup page with:
 * - Email & password registration
 * - Google OAuth
 * - Form validation (password match, min length)
 * - Loading states
 * - Link to login page
 */
export default function Signup() {
  const { signUp, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If already logged in, redirect
  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  // ── Email/Password Signup ───────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await signUp(email, password)
    setLoading(false)
    if (!result.error) {
      navigate('/login')
    }
  }

  const handleGoogleLogin = async () => {
    await signInWithGoogle()
  }

  // ── Styles ──────────────────────────────────────────────
  // (Reusing same styles as Login for consistency)
  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: '100px 24px 60px',
  }

  const cardStyle = {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    borderRadius: 12,
    padding: '40px 32px',
    boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
  }

  const titleStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--black)',
    textAlign: 'center',
    marginBottom: 4,
  }

  const subtitleStyle = {
    textAlign: 'center',
    color: 'var(--mid-gray)',
    fontSize: 13,
    marginBottom: 28,
    fontFamily: 'var(--font-body)',
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    background: 'var(--bg)',
    color: 'var(--black)',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--black)',
    marginBottom: 6,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
  }

  const btnPrimary = {
    width: '100%',
    padding: '14px',
    background: 'var(--black)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  }

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '20px 0',
    color: '#bbb',
    fontSize: 12,
  }

  const dividerLine = {
    flex: 1,
    height: 1,
    background: 'var(--border)',
  }

  const oauthBtn = {
    width: '100%',
    padding: '12px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'border-color 0.2s, background 0.2s',
    color: 'var(--black)',
  }

  const errorBox = {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    fontSize: 13,
    padding: '10px 14px',
    borderRadius: 8,
    marginBottom: 16,
    fontFamily: 'var(--font-body)',
  }

  return (
    <div style={pageStyle} className="auth-page-container">
      <div style={cardStyle} className="auth-card">
        <h1 style={titleStyle} className="auth-title">Create Account</h1>
        <p style={subtitleStyle}>Join K-TEX for a seamless shopping experience</p>

        {/* ── OAuth ── */}
        <button
          style={oauthBtn}
          onClick={handleGoogleLogin}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = '#fdfbf7' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fff' }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continue with Google
        </button>

        {/* ── Divider ── */}
        <div style={dividerStyle}>
          <span style={dividerLine} />
          <span>or sign up with email</span>
          <span style={dividerLine} />
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Inline error message */}
          {error && <div style={errorBox}>{error}</div>}

          <button
            type="submit"
            style={btnPrimary}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* ── Login Link ── */}
        <p style={{
          textAlign: 'center',
          marginTop: 20,
          fontSize: 13,
          color: 'var(--mid-gray)',
          fontFamily: 'var(--font-body)',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: 'var(--gold)',
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Sign In
          </Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .auth-page-container {
            padding: 80px 16px 40px !important;
          }
          .auth-card {
            padding: 30px 20px !important;
          }
          .auth-title {
            font-size: 24px !important;
          }
        }
        @media (max-width: 360px) {
          .auth-page-container {
            padding: 60px 12px 30px !important;
          }
          .auth-card {
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
