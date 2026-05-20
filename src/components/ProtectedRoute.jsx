import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute checks if a user is authenticated.
 * If not logged in, redirects to /login.
 * Shows a loading spinner while checking session state.
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid #eee',
            borderTopColor: 'var(--gold)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <span style={{ color: 'var(--mid-gray)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
            Loading...
          </span>
        </div>
      </div>
    )
  }

  // Not logged in → redirect to login with current location state
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in → render child routes
  return <Outlet />
}
