import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
// Prefer the service role key so server-side calls bypass RLS as intended.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing from environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
