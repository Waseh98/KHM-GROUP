import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured) {
      toast.error('Auth is not configured')
      return { error: { message: 'Auth not configured' } }
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      toast.error(error.message)
      return { error }
    }
    toast.success('Account created! Check your email for confirmation.')
    return { data }
  }

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      toast.error('Auth is not configured')
      return { error: { message: 'Auth not configured' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      return { error }
    }
    toast.success('Welcome back!')
    return { data }
  }

  const signInWithGoogle = async (redirectToPath = '/dashboard') => {
    if (!isSupabaseConfigured) {
      toast.error('Auth is not configured')
      return
    }
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
    if (!isSupabaseConfigured) {
      toast.error('Auth is not configured')
      return
    }
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

  const signOut = async () => {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
  }

  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      toast.error('Auth is not configured')
      return { error: { message: 'Auth not configured' } }
    }
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

export const useAuth = () => useContext(AuthContext)
