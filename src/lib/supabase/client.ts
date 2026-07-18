import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ggxnwihqpaoystbejrax.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_R_7MhH3YlzfPtfW6tK-pmw_m1xThEy6"

// This is a singleton client for client-side interactions if needed.
// For server actions, we'd use a server client.
export const supabase = createClient(supabaseUrl, supabaseKey)
