import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ggxnwihqpaoystbejrax.supabase.co"
const supabaseKey = "sb_publishable_R_7MhH3YlzfPtfW6tK-pmw_m1xThEy6"

// This is a singleton client for client-side interactions if needed.
// For server actions, we'd use a server client.
export const supabase = createClient(supabaseUrl, supabaseKey)
