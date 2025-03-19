import { supabase } from './supabase';
import { logError } from './errorLogging';

// Type definitions for database entities
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'helper' | 'admin';
  avatar_url?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HelperProfile {
  id: string;
  bio: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  services_offered: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  helper_id?: string;
  service_type: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  location?: string;
  scheduled_time?: string;
  created_at?: string;
  updated_at?: string;
}

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
      address: '123 Main St, Anytown, USA',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    },
    { 
      id: 'user-2', 
      email: 'helper@example.com', 
      full_name: 'Helper User', 
      role: 'helper',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Helper',
      phone: '(555) 987-6543',
      address: '456 Oak St, Anytown, USA',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    },
    { 
      id: 'user-3', 
      email: 'admin@example.com', 
      full_name: 'Admin User', 
      role: 'admin',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      phone: '(555) 555-5555',
      address: '789 Pine St, Anytown, USA',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    }
  ],
  helper_profiles: [
    {
      id: 'user-2',
      bio: 'Experienced helper ready to assist seniors',
      verification_status: 'verified',
      services_offered: ['companionship', 'shopping', 'transportation'],
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
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
      scheduled_time: '2023-06-15T14:00:00.000Z',
      created_at: '2023-06-10T10:00:00.000Z',
      updated_at: '2023-06-10T11:00:00.000Z'
    },
    {
      id: 'req-2',
      customer_id: 'user-1',
      service_type: 'transportation',
      status: 'pending',
      description: 'Need a ride to doctor appointment',
      location: '123 Main St, Anytown, USA',
      scheduled_time: '2023-06-20T09:00:00.000Z',
      created_at: '2023-06-12T10:00:00.000Z',
      updated_at: '2023-06-12T10:00:00.000Z'
    }
  ]
};

// Flag to determine if we should use mock data
let useMockData = false;

/**
 * Initialize the database service
 */
export async function initDatabaseService() {
  try {
    // Test the connection to determine if we should use mock data
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
      
    if (error) {
      console.warn('Database connection failed, using mock data:', error.message);
      useMockData = true;
      return false;
    }
    
    console.log('Database connection successful');
    useMockData = false;
    return true;
  } catch (error) {
    console.error('Error initializing database service:', error);
    logError(error, 'DatabaseServiceInit');
    useMockData = true;
    return false;
  }
}

/**
 * Set whether to use mock data
 */
export function setUseMockData(value: boolean) {
  useMockData = value;
}

/**
 * Check if we're using mock data
 */
export function isUsingMockData() {
  return useMockData;
}

/**
 * Get a user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    if (useMockData) {
      const user = mockData.users.find(u => u.id === id);
      return user || null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching user:', error);
      logError(error, 'GetUserById');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching user:', error);
    logError(error, 'GetUserById');
    return null;
  }
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    if (useMockData) {
      const user = mockData.users.find(u => u.email === email);
      return user || null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error) {
      console.error('Error fetching user by email:', error);
      logError(error, 'GetUserByEmail');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching user by email:', error);
    logError(error, 'GetUserByEmail');
    return null;
  }
}

/**
 * Update a user
 */
export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  try {
    if (useMockData) {
      const index = mockData.users.findIndex(u => u.id === id);
      if (index === -1) return null;
      
      mockData.users[index] = {
        ...mockData.users[index],
        ...userData,
        updated_at: new Date().toISOString()
      };
      
      return mockData.users[index];
    }
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user:', error);
      logError(error, 'UpdateUser');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception updating user:', error);
    logError(error, 'UpdateUser');
    return null;
  }
}

/**
 * Get helper profile by user ID
 */
export async function getHelperProfile(userId: string): Promise<HelperProfile | null> {
  try {
    if (useMockData) {
      const profile = mockData.helper_profiles.find(p => p.id === userId);
      return profile || null;
    }
    
    const { data, error } = await supabase
      .from('helper_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching helper profile:', error);
      logError(error, 'GetHelperProfile');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching helper profile:', error);
    logError(error, 'GetHelperProfile');
    return null;
  }
}

/**
 * Get service requests for a customer
 */
export async function getCustomerRequests(customerId: string): Promise<ServiceRequest[]> {
  try {
    if (useMockData) {
      return mockData.service_requests.filter(r => r.customer_id === customerId);
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching customer requests:', error);
      logError(error, 'GetCustomerRequests');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching customer requests:', error);
    logError(error, 'GetCustomerRequests');
    return [];
  }
}

/**
 * Get service requests for a helper
 */
export async function getHelperRequests(helperId: string): Promise<ServiceRequest[]> {
  try {
    if (useMockData) {
      return mockData.service_requests.filter(r => r.helper_id === helperId);
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('helper_id', helperId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching helper requests:', error);
      logError(error, 'GetHelperRequests');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching helper requests:', error);
    logError(error, 'GetHelperRequests');
    return [];
  }
}

/**
 * Create a service request
 */
export async function createServiceRequest(request: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceRequest | null> {
  try {
    if (useMockData) {
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
      .insert({
        ...request,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating service request:', error);
      logError(error, 'CreateServiceRequest');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception creating service request:', error);
    logError(error, 'CreateServiceRequest');
    return null;
  }
}

/**
 * Update a service request
 */
export async function updateServiceRequest(id: string, requestData: Partial<ServiceRequest>): Promise<ServiceRequest | null> {
  try {
    if (useMockData) {
      const index = mockData.service_requests.findIndex(r => r.id === id);
      if (index === -1) return null;
      
      mockData.service_requests[index] = {
        ...mockData.service_requests[index],
        ...requestData,
        updated_at: new Date().toISOString()
      };
      
      return mockData.service_requests[index];
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .update({
        ...requestData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating service request:', error);
      logError(error, 'UpdateServiceRequest');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception updating service request:', error);
    logError(error, 'UpdateServiceRequest');
    return null;
  }
}

/**
 * Get all helpers
 */
export async function getAllHelpers(): Promise<User[]> {
  try {
    if (useMockData) {
      return mockData.users.filter(u => u.role === 'helper');
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'helper');
      
    if (error) {
      console.error('Error fetching helpers:', error);
      logError(error, 'GetAllHelpers');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching helpers:', error);
    logError(error, 'GetAllHelpers');
    return [];
  }
}

/**
 * Get all customers
 */
export async function getAllCustomers(): Promise<User[]> {
  try {
    if (useMockData) {
      return mockData.users.filter(u => u.role === 'customer');
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'customer');
      
    if (error) {
      console.error('Error fetching customers:', error);
      logError(error, 'GetAllCustomers');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching customers:', error);
    logError(error, 'GetAllCustomers');
    return [];
  }
}

/**
 * Verify database schema
 * This function checks if the required tables exist
 */
export async function verifyDatabaseSchema(): Promise<{
  success: boolean;
  issues: string[];
}> {
  try {
    const requiredTables = ['users', 'helper_profiles', 'service_requests'];
    const issues: string[] = [];
    
    // Skip verification if using mock data
    if (useMockData) {
      return { success: true, issues: [] };
    }
    
    for (const table of requiredTables) {
      const { error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
        
      if (error) {
        issues.push(`Table '${table}' issue: ${error.message}`);
      }
    }
    
    return {
      success: issues.length === 0,
      issues
    };
  } catch (error) {
    console.error('Error verifying database schema:', error);
    logError(error, 'VerifyDatabaseSchema');
    return {
      success: false,
      issues: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Run database health check
 */
export async function checkDatabaseHealth(): Promise<{
  connection: boolean;
  schema: boolean;
  issues: string[];
  latency: number;
}> {
  const startTime = performance.now();
  const issues: string[] = [];
  
  try {
    // Test connection
    const { error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
      
    const connectionSuccess = !error;
    
    if (error) {
      issues.push(`Connection error: ${error.message}`);
    }
    
    // Verify schema if connection is successful
    let schemaSuccess = false;
    
    if (connectionSuccess) {
      const schemaCheck = await verifyDatabaseSchema();
      schemaSuccess = schemaCheck.success;
      
      if (!schemaSuccess) {
        issues.push(...schemaCheck.issues);
      }
    }
    
    const endTime = performance.now();
    
    return {
      connection: connectionSuccess,
      schema: schemaSuccess,
      issues,
      latency: endTime - startTime
    };
  } catch (error) {
    console.error('Error checking database health:', error);
    logError(error, 'CheckDatabaseHealth');
    
    const endTime = performance.now();
    
    return {
      connection: false,
      schema: false,
      issues: [error instanceof Error ? error.message : 'Unknown error'],
      latency: endTime - startTime
    };
  }
}

// Initialize the database service when this module is imported
initDatabaseService().catch(error => {
  console.error('Failed to initialize database service:', error);
  logError(error, 'DatabaseServiceInitCatch');
});