import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured, signInWithGoogle as firebaseGoogleSignIn, signUpWithEmail as firebaseSignUp, signInWithEmail as firebaseSignIn, signOutFirebase, sendResetEmail as firebaseResetEmail } from '../lib/firebase'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    if (!isFirebaseConfigured) {
      toast.error('Firebase is not configured')
      return { error: { message: 'Firebase not configured' } }
    }
    const result = await firebaseSignUp(email, password)
    if (result.error) {
      toast.error(result.error.message)
      return result
    }
    toast.success('Account created successfully!')
    return result
  }

  const signIn = async (email, password) => {
    if (!isFirebaseConfigured) {
      toast.error('Firebase is not configured')
      return { error: { message: 'Firebase not configured' } }
    }
    const result = await firebaseSignIn(email, password)
    if (result.error) {
      toast.error(result.error.message)
      return result
    }
    toast.success('Welcome back!')
    return result
  }

  const signInWithGoogle = async (redirectToPath = '/dashboard') => {
    if (!isFirebaseConfigured) {
      toast.error('Firebase is not configured')
      return
    }
    const result = await firebaseGoogleSignIn()
    if (result.error) {
      toast.error(result.error.message)
    }
  }

  const signOut = async () => {
    if (!isFirebaseConfigured) return
    await signOutFirebase()
    toast.success('Signed out successfully')
  }

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured) {
      toast.error('Firebase is not configured')
      return { error: { message: 'Firebase not configured' } }
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
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
