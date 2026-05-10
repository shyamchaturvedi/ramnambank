import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing! Check your .env file.');
}

export const supabase = typeof window !== 'undefined'
  ? createBrowserClient(
      supabaseUrl!,
      supabaseAnonKey!
    )
  : createClient(
      supabaseUrl!,
      supabaseAnonKey!
    );
