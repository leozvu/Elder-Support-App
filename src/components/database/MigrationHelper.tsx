import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Database } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MigrationHelper = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runMigration = async () => {
    setStatus('loading');
    setLogs([]);
    
    try {
      addLog('Starting database migration...');
      
      // Step 1: Check if tables exist
      addLog('Checking if required tables exist...');
      
      const tables = ['users', 'helper_profiles', 'service_requests'];
      const missingTables = [];
      
      for (const table of tables) {
        addLog(`Checking table: ${table}`);
        const { error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });
          
        if (error) {
          addLog(`Table '${table}' not found or error: ${error.message}`);
          missingTables.push(table);
        } else {
          addLog(`Table '${table}' exists`);
        }
      }
      
      if (missingTables.length > 0) {
        addLog('Some tables are missing. Creating tables...');
        
        // Step 2: Create missing tables
        for (const table of missingTables) {
          addLog(`Creating table: ${table}`);
          
          if (table === 'users') {
            const { error } = await supabase.rpc('create_users_table');
            
            if (error) {
              addLog(`Error creating users table: ${error.message}`);
              throw new Error(`Failed to create users table: ${error.message}`);
            } else {
              addLog('Users table created successfully');
            }
          } else if (table === 'helper_profiles') {
            const { error } = await supabase.rpc('create_helper_profiles_table');
            
            if (error) {
              addLog(`Error creating helper_profiles table: ${error.message}`);
              throw new Error(`Failed to create helper_profiles table: ${error.message}`);
            } else {
              addLog('Helper profiles table created successfully');
            }
          } else if (table === 'service_requests') {
            const { error } = await supabase.rpc('create_service_requests_table');
            
            if (error) {
              addLog(`Error creating service_requests table: ${error.message}`);
              throw new Error(`Failed to create service_requests table: ${error.message}`);
            } else {
              addLog('Service requests table created successfully');
            }
          }
        }
      } else {
        addLog('All required tables exist');
      }
      
      // Step 3: Check for demo users
      addLog('Checking for demo users...');
      
      const { data: demoUsers, error: demoUsersError } = await supabase
        .from('users')
        .select('*')
        .in('email', ['martha@example.com', 'helper@example.com', 'admin@example.com']);
        
      if (demoUsersError) {
        addLog(`Error checking demo users: ${demoUsersError.message}`);
      } else if (!demoUsers || demoUsers.length < 3) {
        addLog('Demo users missing or incomplete. Creating demo users...');
        
        // Create demo users
        const { error: createDemoError } = await supabase.rpc('create_demo_users');
        
        if (createDemoError) {
          addLog(`Error creating demo users: ${createDemoError.message}`);
        } else {
          addLog('Demo users created successfully');
        }
      } else {
        addLog(`Found ${demoUsers.length} demo users`);
      }
      
      // Step 4: Verify helper profiles
      addLog('Checking helper profiles...');
      
      const { data: helperProfiles, error: helperProfilesError } = await supabase
        .from('helper_profiles')
        .select('*');
        
      if (helperProfilesError) {
        addLog(`Error checking helper profiles: ${helperProfilesError.message}`);
      } else if (!helperProfiles || helperProfiles.length === 0) {
        addLog('No helper profiles found. Creating demo helper profile...');
        
        // Create demo helper profile
        const { error: createProfileError } = await supabase.rpc('create_demo_helper_profile');
        
        if (createProfileError) {
          addLog(`Error creating demo helper profile: ${createProfileError.message}`);
        } else {
          addLog('Demo helper profile created successfully');
        }
      } else {
        addLog(`Found ${helperProfiles.length} helper profiles`);
      }
      
      // Step 5: Verify service requests
      addLog('Checking service requests...');
      
      const { data: serviceRequests, error: serviceRequestsError } = await supabase
        .from('service_requests')
        .select('*');
        
      if (serviceRequestsError) {
        addLog(`Error checking service requests: ${serviceRequestsError.message}`);
      } else if (!serviceRequests || serviceRequests.length === 0) {
        addLog('No service requests found. Creating demo service requests...');
        
        // Create demo service requests
        const { error: createRequestsError } = await supabase.rpc('create_demo_service_requests');
        
        if (createRequestsError) {
          addLog(`Error creating demo service requests: ${createRequestsError.message}`);
        } else {
          addLog('Demo service requests created successfully');
        }
      } else {
        addLog(`Found ${serviceRequests.length} service requests`);
      }
      
      // Step 6: Final verification
      addLog('Performing final verification...');
      
      const finalCheck = await Promise.all(tables.map(table => 
        supabase.from(table).select('count', { count: 'exact', head: true })
      ));
      
      const finalResult = {
        users: finalCheck[0].count || 0,
        helper_profiles: finalCheck[1].count || 0,
        service_requests: finalCheck[2].count || 0,
        errors: finalCheck.filter(check => check.error).map(check => check.error)
      };
      
      if (finalResult.errors.length > 0) {
        addLog('Final verification found errors:');
        finalResult.errors.forEach(error => addLog(`- ${error.message}`));
        setStatus('error');
      } else {
        addLog('Final verification successful:');
        addLog(`- Users: ${finalResult.users}`);
        addLog(`- Helper profiles: ${finalResult.helper_profiles}`);
        addLog(`- Service requests: ${finalResult.service_requests}`);
        addLog('Migration completed successfully!');
        setStatus('success');
      }
      
      setResult(finalResult);
    } catch (error) {
      console.error('Migration error:', error);
      addLog(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Migration Helper
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Database Migration</AlertTitle>
            <AlertDescription>
              This tool will help you set up or fix your database schema and create demo data.
              Only use this in development or when setting up a new database.
            </AlertDescription>
          </Alert>
          
          {status === 'success' && (
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Migration Successful</AlertTitle>
              <AlertDescription>
                Database migration completed successfully.
              </AlertDescription>
            </Alert>
          )}
          
          {status === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Migration Failed</AlertTitle>
              <AlertDescription>
                {result?.error || 'An error occurred during migration. Check the logs for details.'}
              </AlertDescription>
            </Alert>
          )}
          
          {logs.length > 0 && (
            <div className="bg-black rounded-md p-4 text-white font-mono text-sm">
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runMigration} 
          disabled={status === 'loading'}
          className="w-full"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Migration...
            </>
          ) : (
            "Run Database Migration"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MigrationHelper;