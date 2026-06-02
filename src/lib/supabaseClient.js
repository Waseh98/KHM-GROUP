import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const PLACEHOLDER = 'https://placeholder.supabase.co'
const realConfigured = supabaseUrl && supabaseUrl !== PLACEHOLDER && supabaseUrl.startsWith('https://')

export const supabase = createClient(
  realConfigured ? supabaseUrl : PLACEHOLDER,
  supabaseAnonKey || 'placeholder'
)

export const isSupabaseConfigured = realConfigured