import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Public-site client. If env vars are missing, returns null and the site
// falls back to the static data.js / data-designers.js content.
export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;
