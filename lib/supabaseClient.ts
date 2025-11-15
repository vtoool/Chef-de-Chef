import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Log a clear warning in the browser console if keys are missing
  // This will not crash the app, making it easier to debug setup issues.
  console.warn(
    'Supabase URL or anonymous key is missing from environment variables. ' +
    'Database-dependent features will be disabled in this preview environment.'
  );
}

export { supabase };
