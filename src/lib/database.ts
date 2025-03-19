import { supabase } from './supabase';
import { logError } from './errorLogging';

// Mock data for fallback
const mockData = {
  users: [
    { 
      id: 'user-1', 
      email: 'martha@example.com', 
      full_name: 'Martha Johnson', 
      role: 'customer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, USA'
    },
    { 
      id: 'user-2', 
      email: 'helper@example.com', 
      full_name: 'Helper User', 
      role: 'helper',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Helper',
      phone: '(555) 987-6543',
      address: '456 Oak St, Anytown, USA'
    },
    { 
      id: 'user-3', 
      email: 'admin@example.com', 
      full_name: 'Admin User', 
      role: 'admin',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      phone: '(555) 555-5555',
      address: '789 Pine St, Anytown, USA'
    }
  ],
  helper_profiles: [
    {
      id: 'user-2',
      bio: 'Experienced helper ready to assist seniors',
      verification_status: 'verified',
      services_offered: ['companionship', 'shopping', 'transportation']
    }
  ],
  service_requests: [
    {
      id: 'req-1',
      customer_id: 'user-1',
      helper_id: 'user-2',
      service_type: 'shopping',
      status: 'in_progress',
      description: 'Need help with grocery shopping',
      location: '123 Main St, Anytown, USA',
      scheduled_time: '2023-06-15T14:00:00.000Z'
    },
    {
      id: 'req-2',
      customer_id: 'user-1',
      service_type: 'transportation',
      status: 'pending',
      description: 'Need a ride to doctor appointment',
      location: '123 Main St, Anytown, USA',
      scheduled_time: '2023-06-20T09:00:00.000Z'
    }
  ]
};

/**
 * Check if we should use mock data
 */
export function isUsingMockData() {
  // Check localStorage setting
  const mockSetting = localStorage.getItem('use_mock_data');
  return mockSetting === 'true';
}

/**
 * Get a user by ID
 */
export async function getUserById(id: string) {
  try {
    if (isUsingMockData()) {
      return mockData.users.find(u => u.id === id) || null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching user by ID:', error);
      // Fall back to mock data on error
      return mockData.users.find(u => u.id === id) || null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching user by ID:', error);
    // Fall back to mock data on exception
    return mockData.users.find(u => u.id === id) || null;
  }
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string) {
  try {
    if (isUsingMockData()) {
      return mockData.users.find(u => u.email === email) || null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error) {
      console.error('Error fetching user by email:', error);
      // Fall back to mock data on error
      return mockData.users.find(u => u.email === email) || null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching user by email:', error);
    // Fall back to mock data on exception
    return mockData.users.find(u => u.email === email) || null;
  }
}

/**
 * Get all customers
 */
export async function getAllCustomers() {
  try {
    if (isUsingMockData()) {
      return mockData.users.filter(u => u.role === 'customer');
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'customer');
      
    if (error) {
      console.error('Error fetching customers:', error);
      // Fall back to mock data on error
      return mockData.users.filter(u => u.role === 'customer');
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching customers:', error);
    // Fall back to mock data on exception
    return mockData.users.filter(u => u.role === 'customer');
  }
}

/**
 * Get all helpers
 */
export async function getAllHelpers() {
  try {
    if (isUsingMockData()) {
      return mockData.users.filter(u => u.role === 'helper');
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'helper');
      
    if (error) {
      console.error('Error fetching helpers:', error);
      // Fall back to mock data on error
      return mockData.users.filter(u => u.role === 'helper');
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching helpers:', error);
    // Fall back to mock data on exception
    return mockData.users.filter(u => u.role === 'helper');
  }
}

/**
 * Get helper profile
 */
export async function getHelperProfile(userId: string) {
  try {
    if (isUsingMockData()) {
      return mockData.helper_profiles.find(p => p.id === userId) || null;
    }
    
    const { data, error } = await supabase
      .from('helper_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching helper profile:', error);
      // Fall back to mock data on error
      return mockData.helper_profiles.find(p => p.id === userId) || null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching helper profile:', error);
    // Fall back to mock data on exception
    return mockData.helper_profiles.find(p => p.id === userId) || null;
  }
}

/**
 * Get customer requests
 */
export async function getCustomerRequests(customerId: string) {
  try {
    if (isUsingMockData()) {
      return mockData.service_requests.filter(r => r.customer_id === customerId);
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('customer_id', customerId);
      
    if (error) {
      console.error('Error fetching customer requests:', error);
      // Fall back to mock data on error
      return mockData.service_requests.filter(r => r.customer_id === customerId);
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching customer requests:', error);
    // Fall back to mock data on exception
    return mockData.service_requests.filter(r => r.customer_id === customerId);
  }
}

/**
 * Get helper requests
 */
export async function getHelperRequests(helperId: string) {
  try {
    if (isUsingMockData()) {
      return mockData.service_requests.filter(r => r.helper_id === helperId);
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('helper_id', helperId);
      
    if (error) {
      console.error('Error fetching helper requests:', error);
      // Fall back to mock data on error
      return mockData.service_requests.filter(r => r.helper_id === helperId);
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching helper requests:', error);
    // Fall back to mock data on exception
    return mockData.service_requests.filter(r => r.helper_id === helperId);
  }
}

/**
 * Create a service request
 */
export async function createServiceRequest(request: any) {
  try {
    if (isUsingMockData()) {
      const newRequest = {
        ...request,
        id: `req-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockData.service_requests.push(newRequest);
      return newRequest;
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .insert(request)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating service request:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception creating service request:', error);
    throw error;
  }
}

/**
 * Update a service request
 */
export async function updateServiceRequest(id: string, updates: any) {
  try {
    if (isUsingMockData()) {
      const index = mockData.service_requests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');
      
      mockData.service_requests[index] = {
        ...mockData.service_requests[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return mockData.service_requests[index];
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating service request:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception updating service request:', error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: any) {
  try {
    if (isUsingMockData()) {
      const index = mockData.users.findIndex(u => u.id === userId);
      if (index === -1) throw new Error('User not found');
      
      mockData.users[index] = {
        ...mockData.users[index],
        ...updates
      };
      
      return mockData.users[index];
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception updating user profile:', error);
    throw error;
  }
}

/**
 * Ensure database tables exist
 */
export async function ensureDatabaseSetup() {
  if (isUsingMockData()) {
    console.log('Using mock data, skipping database setup');
    return true;
  }
  
  try {
    // Check if users table exists
    const { error: usersError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
      
    if (usersError) {
      console.error('Users table not found or error:', usersError.message);
      return false;
    }
    
    // Check if helper_profiles table exists
    const { error: profilesError } = await supabase
      .from('helper_profiles')
      .select('count', { count: 'exact', head: true });
      
    if (profilesError) {
      console.error('Helper profiles table not found or error:', profilesError.message);
      return false;
    }
    
    // Check if service_requests table exists
    const { error: requestsError } = await supabase
      .from('service_requests')
      .select('count', { count: 'exact', head: true });
      
    if (requestsError) {
      console.error('Service requests table not found or error:', requestsError.message);
      return false;
    }
    
    console.log('Database setup verified successfully');
    return true;
  } catch (error) {
    console.error('Error verifying database setup:', error);
    return false;
  }
}

// Run database setup check
ensureDatabaseSetup().then(success => {
  if (!success) {
    console.warn('Database setup issues detected, using mock data');
    localStorage.setItem('use_mock_data', 'true');
  }
});