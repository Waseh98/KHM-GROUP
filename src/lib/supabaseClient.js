import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const validUrl = supabaseUrl && supabaseUrl.startsWith('https://') ? supabaseUrl : null

export const supabase = createClient(
  validUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

export const isSupabaseConfigured = !!validUrl