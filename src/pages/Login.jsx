import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isFirebaseConfigured } from '../lib/firebase'
import toast from 'react-hot-toast'

export default function Login() {
  const { signIn, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (!result.error) {
      navigate(from)
    } else {
      setLoginError(result.error.message || 'Login failed. Please try again.')
    }
  }

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
      toast.error('Firebase is not configured. Please add Firebase config to .env')
      return
    }
    await signInWithGoogle(from)
  }

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
    fontFamily: "var(--font-heading)",
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

  return (
    <div style={pageStyle} className="auth-page-container">
      <div style={cardStyle} className="auth-card">
        <h1 style={titleStyle} className="auth-title">Welcome Back</h1>
        <p style={subtitleStyle}>Sign in to your K-TEX account</p>

        {isFirebaseConfigured && (
          <>
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

            <div style={dividerStyle}>
              <span style={dividerLine} />
              <span>or sign in with email</span>
              <span style={dividerLine} />
            </div>
          </>
        )}

        <form onSubmit={handleEmailLogin}>
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

          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link to="/forgot-password" style={{
              fontSize: 12,
              color: 'var(--gold)',
              textDecoration: 'none',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
            }}>
              Forgot Password?
            </Link>
          </div>

          {loginError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: 13,
              padding: '10px 14px',
              borderRadius: 8,
              fontFamily: 'var(--font-body)',
            }}>
              {loginError}
            </div>
          )}

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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: 20,
          fontSize: 13,
          color: 'var(--mid-gray)',
          fontFamily: 'var(--font-body)',
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{
            color: 'var(--gold)',
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Sign Up
          </Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .auth-page-container { padding: 80px 16px 40px !important; }
          .auth-card { padding: 30px 20px !important; }
          .auth-title { font-size: 24px !important; }
        }
        @media (max-width: 360px) {
          .auth-page-container { padding: 60px 12px 30px !important; }
          .auth-card { padding: 24px 16px !important; }
        }
      `}</style>
    </div>
  )
}
