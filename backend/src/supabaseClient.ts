import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

/** Standard client — uses anon key, subject to RLS policies */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Admin client — uses service role key, bypasses RLS */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
