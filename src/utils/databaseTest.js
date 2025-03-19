import { supabase } from '@/lib/supabase';

/**
 * Run a comprehensive database connection test
 */
export async function testDatabaseConnection() {
  console.log('Starting database connection test...');
  
  try {
    // Step 1: Test basic connection
    console.log('Testing basic connection...');
    const { data: connectionData, error: connectionError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
      
    if (connectionError) {
      console.error('Basic connection test failed:', connectionError);
      return {
        success: false,
        stage: 'basic_connection',
        error: connectionError.message,
        details: connectionError
      };
    }
    
    console.log('Basic connection successful');
    
    // Step 2: Test auth connection
    console.log('Testing auth connection...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Auth connection test failed:', authError);
      return {
        success: false,
        stage: 'auth_connection',
        error: authError.message,
        details: authError
      };
    }
    
    console.log('Auth connection successful');
    
    // Step 3: Test table access
    console.log('Testing table access...');
    const tables = ['users', 'helper_profiles', 'service_requests'];
    const tableResults = {};
    
    for (const table of tables) {
      console.log(`Testing access to ${table} table...`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.error(`Access to ${table} failed:`, error);
        tableResults[table] = {
          success: false,
          error: error.message
        };
      } else {
        console.log(`Access to ${table} successful`);
        tableResults[table] = {
          success: true,
          hasData: data && data.length > 0
        };
      }
    }
    
    // Step 4: Test RLS policies
    console.log('Testing RLS policies...');
    let rlsTest = { success: true };
    
    if (authData.session) {
      // We have a logged-in user, test RLS
      const userId = authData.session.user.id;
      
      // Try to access data that should be accessible
      const { error: rlsError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (rlsError) {
        console.error('RLS test failed:', rlsError);
        rlsTest = {
          success: false,
          error: rlsError.message
        };
      } else {
        console.log('RLS test successful');
      }
    } else {
      console.log('Skipping RLS test - no authenticated user');
    }
    
    return {
      success: true,
      connectionTest: { success: true },
      authTest: { success: true },
      tableTests: tableResults,
      rlsTest
    };
  } catch (error) {
    console.error('Unexpected error during database test:', error);
    return {
      success: false,
      stage: 'unexpected_error',
      error: error.message,
      details: error
    };
  }
}

/**
 * Test database schema integrity
 */
export async function testDatabaseSchema() {
  console.log('Testing database schema integrity...');
  
  try {
    // Check users table schema
    const { data: usersColumns, error: usersError } = await supabase
      .rpc('get_table_columns', { table_name: 'users' });
      
    if (usersError) {
      console.error('Failed to get users table schema:', usersError);
      return {
        success: false,
        stage: 'schema_check',
        error: usersError.message
      };
    }
    
    // Check helper_profiles table schema
    const { data: profilesColumns, error: profilesError } = await supabase
      .rpc('get_table_columns', { table_name: 'helper_profiles' });
      
    if (profilesError) {
      console.error('Failed to get helper_profiles table schema:', profilesError);
      return {
        success: false,
        stage: 'schema_check',
        error: profilesError.message
      };
    }
    
    // Check service_requests table schema
    const { data: requestsColumns, error: requestsError } = await supabase
      .rpc('get_table_columns', { table_name: 'service_requests' });
      
    if (requestsError) {
      console.error('Failed to get service_requests table schema:', requestsError);
      return {
        success: false,
        stage: 'schema_check',
        error: requestsError.message
      };
    }
    
    return {
      success: true,
      schema: {
        users: usersColumns,
        helper_profiles: profilesColumns,
        service_requests: requestsColumns
      }
    };
  } catch (error) {
    console.error('Unexpected error during schema test:', error);
    return {
      success: false,
      stage: 'unexpected_error',
      error: error.message,
      details: error
    };
  }
}

/**
 * Create a stored procedure to get table columns
 * This function should be run once to set up the database
 */
export async function createSchemaHelperFunctions() {
  try {
    const { error } = await supabase.rpc('create_schema_helper_functions');
    
    if (error) {
      console.error('Failed to create schema helper functions:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Unexpected error creating schema helper functions:', error);
    return {
      success: false,
      error: error.message
    };
  }
}