// File: lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Always use environment variables for sensitive data
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sypkptdiktvvbnmhtqtx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5cGtwdGRpa3R2dmJubWh0cXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDY1MjUsImV4cCI6MjA2NzAyMjUyNX0.mCZqReQLfNAxvtdaLhq--JYDfOeIfFG3vU_aPUNMpBA';

// Enhanced Supabase client with TypeScript support
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Optional: Add realtime subscriptions
export const getRealtimeClient = () => 
  createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { params: { eventsPerSecond: 10 } }
  });