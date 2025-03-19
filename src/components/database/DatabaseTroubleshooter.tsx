import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Database, RefreshCw, Table, ArrowRight } from 'lucide-react';
import { testDatabaseConnection, testDatabaseSchema, createSchemaHelperFunctions } from '@/utils/databaseTest';
import { supabase } from '@/lib/supabase';

const DatabaseTroubleshooter = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [schemaResult, setSchemaResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isFixing, setIsFixing] = useState(false);
  const [envVars, setEnvVars] = useState<{[key: string]: string | null}>({});

  useEffect(() => {
    // Check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    setEnvVars({
      VITE_SUPABASE_URL: supabaseUrl ? "✓ Defined" : "✗ Missing",
      VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? "✓ Defined" : "✗ Missing",
    });
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runDiagnostics = async () => {
    setStatus('loading');
    setLogs([]);
    
    try {
      addLog('Starting database diagnostics...');
      
      // Step 1: Check environment variables
      addLog('Checking environment variables...');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        addLog('❌ Environment variables are missing!');
        if (!supabaseUrl) addLog('  - VITE_SUPABASE_URL is not defined');
        if (!supabaseAnonKey) addLog('  - VITE_SUPABASE_ANON_KEY is not defined');
        
        setStatus('error');
        return;
      }
      
      addLog('✅ Environment variables are properly defined');
      
      // Step 2: Test database connection
      addLog('Testing database connection...');
      const connectionTest = await testDatabaseConnection();
      setConnectionResult(connectionTest);
      
      if (!connectionTest.success) {
        addLog(`❌ Database connection failed: ${connectionTest.error}`);
        addLog(`  - Failed at stage: ${connectionTest.stage}`);
        
        setStatus('error');
        return;
      }
      
      addLog('✅ Database connection successful');
      
      // Step 3: Test database schema
      addLog('Testing database schema...');
      
      // First, try to create the schema helper functions
      addLog('Setting up schema helper functions...');
      await createSchemaHelperFunctions();
      
      const schemaTest = await testDatabaseSchema();
      setSchemaResult(schemaTest);
      
      if (!schemaTest.success) {
        addLog(`❌ Schema test failed: ${schemaTest.error}`);
        addLog(`  - Failed at stage: ${schemaTest.stage}`);
        
        setStatus('error');
        return;
      }
      
      addLog('✅ Schema test successful');
      
      // Step 4: Check table data
      addLog('Checking table data...');
      
      for (const table of ['users', 'helper_profiles', 'service_requests']) {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });
          
        if (error) {
          addLog(`❌ Error counting rows in ${table}: ${error.message}`);
        } else {
          addLog(`✅ Table ${table} has ${data.count} rows`);
        }
      }
      
      // Step 5: Check auth integration
      addLog('Checking auth integration...');
      
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        addLog(`❌ Auth error: ${authError.message}`);
      } else if (authData.session) {
        addLog(`✅ Auth session found for user: ${authData.session.user.email}`);
        
        // Check if user exists in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.session.user.id)
          .single();
          
        if (userError) {
          addLog(`❌ User not found in users table: ${userError.message}`);
        } else {
          addLog(`✅ User found in users table with role: ${userData.role}`);
        }
      } else {
        addLog('ℹ️ No auth session found (not logged in)');
      }
      
      addLog('Diagnostics completed successfully!');
      setStatus('success');
    } catch (error) {
      console.error('Error during diagnostics:', error);
      addLog(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
    }
  };

  const fixDatabaseIssues = async () => {
    setIsFixing(true);
    setLogs([]);
    
    try {
      addLog('Starting database fix process...');
      
      // Step 1: Check if tables exist and create them if needed
      addLog('Checking database tables...');
      
      const tables = ['users', 'helper_profiles', 'service_requests'];
      
      for (const table of tables) {
        addLog(`Checking table: ${table}`);
        
        const { error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });
          
        if (error) {
          addLog(`Table '${table}' not found or error: ${error.message}`);
          addLog(`Creating table: ${table}`);
          
          if (table === 'users') {
            const { error: createError } = await supabase.rpc('create_users_table');
            
            if (createError) {
              addLog(`❌ Error creating users table: ${createError.message}`);
            } else {
              addLog('✅ Users table created successfully');
            }
          } else if (table === 'helper_profiles') {
            const { error: createError } = await supabase.rpc('create_helper_profiles_table');
            
            if (createError) {
              addLog(`❌ Error creating helper_profiles table: ${createError.message}`);
            } else {
              addLog('✅ Helper profiles table created successfully');
            }
          } else if (table === 'service_requests') {
            const { error: createError } = await supabase.rpc('create_service_requests_table');
            
            if (createError) {
              addLog(`❌ Error creating service_requests table: ${createError.message}`);
            } else {
              addLog('✅ Service requests table created successfully');
            }
          }
        } else {
          addLog(`✅ Table ${table} exists`);
        }
      }
      
      // Step 2: Create demo data if needed
      addLog('Checking for demo data...');
      
      const { data: demoUsers, error: demoUsersError } = await supabase
        .from('users')
        .select('*')
        .in('email', ['martha@example.com', 'helper@example.com', 'admin@example.com']);
        
      if (demoUsersError) {
        addLog(`❌ Error checking demo users: ${demoUsersError.message}`);
      } else if (!demoUsers || demoUsers.length < 3) {
        addLog('Demo users missing or incomplete. Creating demo users...');
        
        const { error: createDemoError } = await supabase.rpc('create_demo_users');
        
        if (createDemoError) {
          addLog(`❌ Error creating demo users: ${createDemoError.message}`);
        } else {
          addLog('✅ Demo users created successfully');
        }
      } else {
        addLog(`✅ Found ${demoUsers.length} demo users`);
      }
      
      // Step 3: Create helper profiles if needed
      addLog('Checking helper profiles...');
      
      const { data: helperProfiles, error: helperProfilesError } = await supabase
        .from('helper_profiles')
        .select('*');
        
      if (helperProfilesError) {
        addLog(`❌ Error checking helper profiles: ${helperProfilesError.message}`);
      } else if (!helperProfiles || helperProfiles.length === 0) {
        addLog('No helper profiles found. Creating demo helper profile...');
        
        const { error: createProfileError } = await supabase.rpc('create_demo_helper_profile');
        
        if (createProfileError) {
          addLog(`❌ Error creating demo helper profile: ${createProfileError.message}`);
        } else {
          addLog('✅ Demo helper profile created successfully');
        }
      } else {
        addLog(`✅ Found ${helperProfiles.length} helper profiles`);
      }
      
      // Step 4: Create service requests if needed
      addLog('Checking service requests...');
      
      const { data: serviceRequests, error: serviceRequestsError } = await supabase
        .from('service_requests')
        .select('*');
        
      if (serviceRequestsError) {
        addLog(`❌ Error checking service requests: ${serviceRequestsError.message}`);
      } else if (!serviceRequests || serviceRequests.length === 0) {
        addLog('No service requests found. Creating demo service requests...');
        
        const { error: createRequestsError } = await supabase.rpc('create_demo_service_requests');
        
        if (createRequestsError) {
          addLog(`❌ Error creating demo service requests: ${createRequestsError.message}`);
        } else {
          addLog('✅ Demo service requests created successfully');
        }
      } else {
        addLog(`✅ Found ${serviceRequests.length} service requests`);
      }
      
      // Step 5: Run diagnostics again to verify fixes
      addLog('Running diagnostics to verify fixes...');
      await runDiagnostics();
      
      addLog('Fix process completed!');
    } catch (error) {
      console.error('Error during fix process:', error);
      addLog(`❌ Unexpected error during fix: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Troubleshooter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium mb-2">Environment Variables</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span>{key}:</span>
                  <span
                    className={
                      value?.includes("✗") ? "text-red-500" : "text-green-500"
                    }
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <Tabs defaultValue="diagnostics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="diagnostics">
              <div className="space-y-4">
                {status === 'success' && (
                  <Alert variant="success">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Diagnostics Successful</AlertTitle>
                    <AlertDescription>
                      Your database connection and schema are working correctly.
                    </AlertDescription>
                  </Alert>
                )}
                
                {status === 'error' && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Diagnostics Failed</AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">There are issues with your database connection or schema.</p>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={fixDatabaseIssues}
                        disabled={isFixing}
                      >
                        {isFixing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Fixing Issues...
                          </>
                        ) : (
                          "Fix Database Issues"
                        )}
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                
                {connectionResult && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Connection Test Results</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                          {connectionResult.connectionTest?.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">Basic Connection</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                          {connectionResult.authTest?.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">Auth Connection</span>
                        </div>
                      </div>
                    </div>
                    
                    {connectionResult.tableTests && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Table Access</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(connectionResult.tableTests).map(([table, result]: [string, any]) => (
                            <div key={table} className="p-2 bg-gray-50 rounded-md">
                              <div className="flex items-center gap-2">
                                {result.success ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm">{table}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {schemaResult && schemaResult.success && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Schema Test Results</h3>
                    
                    <div className="space-y-4">
                      {Object.entries(schemaResult.schema).map(([table, columns]: [string, any]) => (
                        <div key={table} className="space-y-1">
                          <h4 className="text-sm font-medium">{table} Table Schema</h4>
                          <div className="bg-gray-50 p-2 rounded-md">
                            <div className="grid grid-cols-3 gap-2 text-xs font-medium border-b pb-1 mb-1">
                              <div>Column</div>
                              <div>Type</div>
                              <div>Nullable</div>
                            </div>
                            {columns.map((column: any, index: number) => (
                              <div key={index} className="grid grid-cols-3 gap-2 text-xs">
                                <div>{column.column_name}</div>
                                <div>{column.data_type}</div>
                                <div>{column.is_nullable ? 'Yes' : 'No'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="logs">
              <div className="bg-black rounded-md p-4 text-white font-mono text-sm">
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <div key={index}>{log}</div>
                    ))
                  ) : (
                    <div className="text-gray-400">No logs yet. Run diagnostics to see logs.</div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setLogs([])}
          disabled={logs.length === 0}
        >
          Clear Logs
        </Button>
        <Button 
          onClick={runDiagnostics} 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseTroubleshooter;