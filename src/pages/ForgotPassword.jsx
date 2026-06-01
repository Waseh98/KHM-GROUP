import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Forgot Password page.
 * Sends a password reset link to the user's email via Supabase.
 * Shows success state after sending.
 */
export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await resetPassword(email)
    setLoading(false)
    if (result.success) {
      setSent(true)
    }
  }

  // ── Styles (matching Login/Signup) ──
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
    textAlign: 'center',
  }

  const titleStyle = {
    fontFamily: "var(--font-heading)",
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--black)',
    marginBottom: 4,
  }

  const subtitleStyle = {
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
    textAlign: 'left',
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

  const successBox = {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#166534',
    fontSize: 14,
    padding: '16px',
    borderRadius: 8,
    marginBottom: 20,
    fontFamily: 'var(--font-body)',
  }

  return (
    <div style={pageStyle} className="auth-page-container">
      <div style={cardStyle} className="auth-card">
        <h1 style={titleStyle} className="auth-title">Reset Password</h1>
        <p style={subtitleStyle}>
          Enter your email and we'll send you a reset link
        </p>

        {sent ? (
          <>
            <div style={successBox}>
              ✓ Password reset link sent to <strong>{email}</strong>.
              Check your inbox (and spam folder).
            </div>
            <Link
              to="/login"
              style={{
                color: 'var(--gold)',
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
              }}
            >
              Back to Sign In
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
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
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}

        {/* ── Back to Login ── */}
        {!sent && (
          <p style={{
            marginTop: 20,
            fontSize: 13,
            color: 'var(--mid-gray)',
            fontFamily: 'var(--font-body)',
          }}>
            Remember your password?{' '}
            <Link to="/login" style={{
              color: 'var(--gold)',
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Sign In
            </Link>
          </p>
        )}
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
