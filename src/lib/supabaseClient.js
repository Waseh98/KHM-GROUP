import { createClient } from '@supabase/supabase-js'

// Read Supabase credentials from environment variables
// These are set in the .env file at the project root
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create and export the Supabase client instance
// This single instance is reused across the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
