import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// SSR wala browser client use karein taaki cookies sync hon
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)