import { supabase } from './supabase';
import { Tables } from '@/types/supabase';

// Type definitions
type User = Tables<'users'>;
type ServiceRequest = Tables<'service_requests'>;
type HelperProfile = Tables<'helper_profiles'>;

// Local database service
class LocalDatabase {
  // User methods
  async getCurrentUser(): Promise<User | null> {
    try {
      // First check if we're using local auth
      const localAuthMethod = localStorage.getItem('senior_assist_auth_method');
      if (localAuthMethod === 'local') {
        const localUserStr = localStorage.getItem('senior_assist_user');
        if (localUserStr) {
          return JSON.parse(localUserStr);
        }
        return null;
      }
      
      // Otherwise use Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }
  
  async getUserDetails(userId?: string): Promise<User | null> {
    try {
      if (!userId) {
        // If no userId provided, get current user
        return this.getCurrentUser();
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user details:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getUserDetails:', error);
      return null;
    }
  }
  
  // Service request methods
  async getServiceRequests(userId: string, role: string): Promise<ServiceRequest[]> {
    try {
      let query;
      
      if (role === 'customer') {
        // Customer sees their own requests
        query = supabase
          .from('service_requests')
          .select(`
            *,
            service_type:service_type_id(*),
            helper:helper_id(*)
          `)
          .eq('customer_id', userId)
          .order('scheduled_time', { ascending: false });
      } else if (role === 'helper') {
        // Helper sees requests assigned to them
        query = supabase
          .from('service_requests')
          .select(`
            *,
            service_type:service_type_id(*),
            customer:customer_id(*)
          `)
          .eq('helper_id', userId)
          .order('scheduled_time', { ascending: false });
      } else {
        // Admin sees all requests
        query = supabase
          .from('service_requests')
          .select(`
            *,
            service_type:service_type_id(*),
            helper:helper_id(*),
            customer:customer_id(*)
          `)
          .order('scheduled_time', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching service requests:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getServiceRequests:', error);
      return [];
    }
  }
  
  async getServiceRequest(requestId: string): Promise<ServiceRequest | null> {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          service_type:service_type_id(*),
          helper:helper_id(*),
          customer:customer_id(*)
        `)
        .eq('id', requestId)
        .single();
        
      if (error) {
        console.error('Error fetching service request:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getServiceRequest:', error);
      return null;
    }
  }
  
  // Helper methods
  async getHelperProfile(helperId: string): Promise<HelperProfile | null> {
    try {
      const { data, error } = await supabase
        .from('helper_profiles')
        .select('*')
        .eq('id', helperId)
        .single();
        
      if (error) {
        console.error('Error fetching helper profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getHelperProfile:', error);
      return null;
    }
  }
  
  // Generic database access
  from<T extends keyof Tables>(table: T) {
    return supabase.from<T>(table);
  }
}

export const db = new LocalDatabase();