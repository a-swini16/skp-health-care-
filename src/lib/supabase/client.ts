import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key"

// This is a singleton client for client-side interactions if needed.
// For server actions, we'd use a server client.
export const supabase = createClient(supabaseUrl, supabaseKey)
