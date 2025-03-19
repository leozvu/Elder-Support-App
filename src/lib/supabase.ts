import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a custom error handler to prevent crashes
const customFetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error('Supabase fetch error:', error);
    // Return a mock response to prevent crashes
    return new Response(JSON.stringify({ error: 'Network error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: customFetch,
  },
});