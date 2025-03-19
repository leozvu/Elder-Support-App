import { createClient } from '@supabase/supabase-js';
import { logError } from './errorLogging';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create the Supabase client with proper configuration
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    },
    fetch: fetch.bind(globalThis) // Ensure fetch is properly bound
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test the connection and log the result
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
      
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    return false;
  }
}

// Run the test immediately
testConnection().then(connected => {
  if (!connected) {
    console.warn('Using mock data due to connection failure');
    localStorage.setItem('use_mock_data', 'true');
  } else {
    localStorage.setItem('use_mock_data', 'false');
  }
});