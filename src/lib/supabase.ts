import { createClient } from '@supabase/supabase-js';
import { logError } from './errorLogging';

// Initialize Supabase client with better error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log configuration issues
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing. Please check your environment variables.');
  // Set a flag in localStorage to indicate configuration issues
  localStorage.setItem('supabaseConfigIssue', 'true');
}

// Create a custom fetch function with timeout and error handling
const customFetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  // Create an abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Log the error with context
    logError(error, 'Supabase Fetch');
    
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

// Test the connection and log the result
export const testSupabaseConnection = async () => {
  try {
    const start = performance.now();
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    const end = performance.now();
    
    if (error) {
      logError(error, 'Supabase Connection Test');
      console.error('Supabase connection test failed:', error.message);
      return { success: false, message: error.message, latency: end - start };
    }
    
    console.log(`Supabase connection successful! Latency: ${Math.round(end - start)}ms`);
    return { success: true, latency: end - start };
  } catch (error) {
    logError(error, 'Supabase Connection Test');
    console.error('Exception during Supabase connection test:', error);
    return { success: false, message: String(error), latency: null };
  }
};

// Run the test immediately
testSupabaseConnection().then(result => {
  localStorage.setItem('supabaseConnectionTest', JSON.stringify(result));
});