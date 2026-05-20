import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

// Create the auth context
const AuthContext = createContext(null)

/**
 * AuthProvider wraps the entire app and provides:
 * - User session state
 * - Login/signup/logout methods
 * - OAuth methods (Google, Facebook)
 * - Password reset functionality
 * - Automatic session persistence on refresh
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── On mount: check for existing session ─────────────────
  useEffect(() => {
    // Check if a session already exists (e.g. page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  // ── Email & Password Signup ──────────────────────────────
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      toast.error(error.message)
      return { error }
    }
    toast.success('Account created! Check your email for confirmation.')
    return { data }
  }

  // ── Email & Password Login ───────────────────────────────
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      return { error }
    }
    toast.success('Welcome back!')
    return { data }
  }

  // ── OAuth Login (Google, Facebook, etc.) ─────────────────
  const signInWithGoogle = async (redirectToPath = '/dashboard') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectToPath}`
      }
    })
    if (error) {
      toast.error(error.message)
    }
  }

  const signInWithFacebook = async (redirectToPath = '/dashboard') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}${redirectToPath}`
      }
    })
    if (error) {
      toast.error(error.message)
    }
  }

  // ── Logout ───────────────────────────────────────────────
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Logged out successfully')
  }

  // ── Forgot Password ──────────────────────────────────────
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    if (error) {
      toast.error(error.message)
      return { error }
    }
    toast.success('Password reset link sent to your email!')
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      signInWithFacebook,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for consuming auth context
export const useAuth = () => useContext(AuthContext)
