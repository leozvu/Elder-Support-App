import { createClient } from '@supabase/supabase-js';
import { logError } from './errorLogging';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Test the connection to Supabase
 */
export async function testSupabaseConnection() {
  const startTime = performance.now();
  
  try {
    // Check if environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        message: 'Supabase URL or Anon Key is not defined',
        timestamp: new Date().toISOString()
      };
    }
    
    // Test a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
      
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    if (error) {
      logError(error, 'SupabaseConnectionTest');
      return {
        success: false,
        message: error.message,
        latency,
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      success: true,
      latency,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    logError(error, 'SupabaseConnectionTest');
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      latency,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check if we should use mock data instead of Supabase
 */
export function shouldUseMockData() {
  // Check if we're in development mode
  const isDev = import.meta.env.DEV;
  
  // Check if Supabase connection is disabled
  const disableMock = localStorage.getItem('disable_mock_data') === 'true';
  
  // Check if we have a successful connection test result
  const connectionTest = localStorage.getItem('supabaseConnectionTest');
  let isConnected = false;
  
  if (connectionTest) {
    try {
      const result = JSON.parse(connectionTest);
      isConnected = result.success;
    } catch (e) {
      console.error('Failed to parse connection test result:', e);
    }
  }
  
  // Use mock data if we're in development and not connected to Supabase
  // unless mock data is explicitly disabled
  return isDev && !isConnected && !disableMock;
}

/**
 * Create a fallback client that uses mock data
 */
export const createFallbackClient = () => {
  // This is a simplified mock implementation
  // In a real app, you would implement more sophisticated mocking
  
  const mockData = {
    users: [
      { id: 'user1', email: 'martha@example.com', full_name: 'Martha Johnson', role: 'customer' },
      { id: 'user2', email: 'helper@example.com', full_name: 'Helper User', role: 'helper' },
      { id: 'user3', email: 'admin@example.com', full_name: 'Admin User', role: 'admin' }
    ]
  };
  
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: () => {
            const data = mockData[table as keyof typeof mockData]?.find(item => item[column as keyof typeof item] === value);
            return { data, error: null };
          }
        }),
        data: mockData[table as keyof typeof mockData] || [],
        error: null
      })
    }),
    auth: {
      getSession: () => ({ data: { session: null }, error: null }),
      signInWithPassword: ({ email, password }: { email: string, password: string }) => {
        const user = mockData.users.find(u => u.email === email);
        if (user && password === 'password123') {
          return { data: { user }, error: null };
        }
        return { data: null, error: { message: 'Invalid login credentials' } };
      },
      signOut: () => ({ error: null })
    }
  };
};