import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with better error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log configuration issues
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing. Using demo mode.');
  // Set a flag in localStorage to indicate configuration issues
  localStorage.setItem('supabaseConfigIssue', 'true');
}

// Create a custom fetch function with timeout and error handling
const customFetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  // Create an abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    // If we're in demo mode, simulate a successful response
    if (localStorage.getItem('supabaseConfigIssue') === 'true') {
      clearTimeout(timeoutId);
      return new Response(JSON.stringify({ data: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    console.error('Supabase fetch error:', error);
    
    // Determine if it's a timeout
    const isTimeout = error.name === 'AbortError';
    
    // Return a mock response to prevent crashes
    return new Response(
      JSON.stringify({ 
        error: isTimeout ? 'Request timed out' : 'Network error',
        details: error.message
      }), 
      {
        status: isTimeout ? 408 : 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Create the Supabase client with robust error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: customFetch,
  },
});

// Test the connection
export const testSupabaseConnection = async () => {
  try {
    // If we're in demo mode, return a simulated success
    if (localStorage.getItem('supabaseConfigIssue') === 'true') {
      return { success: true, demo: true };
    }
    
    const start = performance.now();
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    const end = performance.now();
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return { success: false, message: error.message, latency: end - start };
    }
    
    console.log(`Supabase connection successful! Latency: ${Math.round(end - start)}ms`);
    return { success: true, latency: end - start };
  } catch (error) {
    console.error('Exception during Supabase connection test:', error);
    return { success: false, message: String(error), latency: null };
  }
};

// Run the test immediately
testSupabaseConnection().then(result => {
  localStorage.setItem('supabaseConnectionTest', JSON.stringify(result));
});