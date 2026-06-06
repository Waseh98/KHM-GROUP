import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const PLACEHOLDER = 'placeholder'
const realConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== PLACEHOLDER && firebaseConfig.apiKey.length > 10

const app = realConfigured ? initializeApp(firebaseConfig) : null
export const auth = app ? getAuth(app) : null
export const googleProvider = new GoogleAuthProvider()

export const isFirebaseConfigured = realConfigured

export const signInWithGoogle = async () => {
  if (!auth) return { error: { message: 'Firebase not configured' } }
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return { user: result.user }
  } catch (error) {
    return { error }
  }
}

export const signUpWithEmail = async (email, password) => {
  if (!auth) return { error: { message: 'Firebase not configured' } }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { user: result.user }
  } catch (error) {
    return { error }
  }
}

export const signInWithEmail = async (email, password) => {
  if (!auth) return { error: { message: 'Firebase not configured' } }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { user: result.user }
  } catch (error) {
    return { error }
  }
}

export const signOutFirebase = async () => {
  if (!auth) return
  await signOut(auth)
}

export const sendResetEmail = async (email) => {
  if (!auth) return { error: { message: 'Firebase not configured' } }
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (error) {
    return { error }
  }
}
