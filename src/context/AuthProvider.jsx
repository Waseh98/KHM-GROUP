import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured, signInWithGoogle as firebaseGoogleSignIn, signUpWithEmail as firebaseSignUp, signInWithEmail as firebaseSignIn, signOutFirebase, sendResetEmail as firebaseResetEmail } from '../lib/firebase'
import { apiRequest } from '../utils/api'
import { getStoredUser, getUserToken, setUserAuth, clearUserAuth, normalizeBackendUser } from '../utils/userAuth'
import { AuthContext } from './authContext'
import toast from 'react-hot-toast'

async function syncFirebaseUserToBackend(firebaseUser) {
  const idToken = await firebaseUser.getIdToken()
  const data = await apiRequest('/api/auth/firebase-login', {
    method: 'POST',
    auth: false,
    body: { token: idToken },
  })
  const normalized = normalizeBackendUser(data.user)
  setUserAuth({ token: data.token, user: normalized })
  return normalized
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    isFirebaseConfigured && auth ? null : getStoredUser()
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      let alive = true
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!alive) return
        if (!firebaseUser) {
          clearUserAuth()
          setUser(null)
          setLoading(false)
          return
        }
        try {
          const normalized = await syncFirebaseUserToBackend(firebaseUser)
          if (alive) setUser(normalized)
        } catch (err) {
          clearUserAuth()
          if (alive) setUser(null)
          toast.error(err.message || 'Could not connect your account to the server')
        } finally {
          if (alive) setLoading(false)
        }
      })
      return () => {
        alive = false
        unsubscribe()
      }
    }

    let alive = true
    async function restoreSession() {
      const token = getUserToken()
      if (!token) {
        if (alive) setLoading(false)
        return
      }
      try {
        const data = await apiRequest('/api/auth/me', { token })
        const normalized = normalizeBackendUser(data.data)
        setUserAuth({ token, user: normalized })
        if (alive) setUser(normalized)
      } catch {
        clearUserAuth()
        if (alive) setUser(null)
      } finally {
        if (alive) setLoading(false)
      }
    }

    restoreSession()
    return () => { alive = false }
  }, [])

  const signUp = async (email, password, name) => {
    if (isFirebaseConfigured) {
      const result = await firebaseSignUp(email, password)
      if (result.error) {
        toast.error(result.error.message)
        return result
      }
      toast.success('Account created successfully!')
      return result
    }

    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        auth: false,
        body: { email, password, name: name || email.split('@')[0] },
      })
      const normalized = normalizeBackendUser(data.user)
      setUserAuth({ token: data.token, user: normalized })
      setUser(normalized)
      toast.success('Account created successfully!')
      return { user: normalized }
    } catch (err) {
      toast.error(err.message || 'Signup failed')
      return { error: { message: err.message || 'Signup failed' } }
    }
  }

  const signIn = async (email, password) => {
    if (isFirebaseConfigured) {
      const result = await firebaseSignIn(email, password)
      if (result.error) {
        toast.error(result.error.message)
        return result
      }
      toast.success('Welcome back!')
      return result
    }

    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password },
      })
      const normalized = normalizeBackendUser(data.user)
      setUserAuth({ token: data.token, user: normalized })
      setUser(normalized)
      toast.success('Welcome back!')
      return { user: normalized }
    } catch (err) {
      toast.error(err.message || 'Login failed')
      return { error: { message: err.message || 'Login failed' } }
    }
  }

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      toast.error('Google sign-in requires Firebase configuration')
      return
    }
    const result = await firebaseGoogleSignIn()
    if (result.error) {
      toast.error(result.error.message)
    }
  }

  const signOut = async () => {
    if (isFirebaseConfigured && auth) {
      await signOutFirebase()
    }
    clearUserAuth()
    setUser(null)
    toast.success('Signed out successfully')
  }

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured) {
      const msg = 'Password reset is not available locally. Contact support or use your existing password.'
      toast.error(msg)
      return { error: { message: msg } }
    }
    const result = await firebaseResetEmail(email)
    if (result.error) {
      toast.error(result.error.message)
      return result
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
      resetPassword,
      isFirebaseConfigured,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
