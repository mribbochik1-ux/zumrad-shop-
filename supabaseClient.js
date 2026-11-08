// Supabase client initialization (optional, can be plugged with real Supabase or Lovable Cloud URL & key)
import { DataService } from './dataService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = {
  // If Supabase environment variables are missing, this acts as bridge to DataService
  configured: isSupabaseConfigured,
  url: supabaseUrl || null,
};
