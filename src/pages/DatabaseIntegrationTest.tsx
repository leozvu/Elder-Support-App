import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Database, RefreshCw, Table } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import DatabaseTroubleshooter from '@/components/database/DatabaseTroubleshooter';
import { supabase } from '@/lib/supabase';
import { getUserById, getUserByEmail, getAllCustomers, getAllHelpers, getHelperProfile, getCustomerRequests } from '@/lib/database';

const DatabaseIntegrationTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runIntegrationTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Get user by ID
      await testFunction('getUserById', async () => {
        const user = await getUserById('00000000-0000-0000-0000-000000000011');
        if (!user) throw new Error('User not found');
        return `Found user: ${user.full_name}`;
      });
      
      // Test 2: Get user by email
      await testFunction('getUserByEmail', async () => {
        const user = await getUserByEmail('martha@example.com');
        if (!user) throw new Error('User not found');
        return `Found user: ${user.full_name}`;
      });
      
      // Test 3: Get all customers
      await testFunction('getAllCustomers', async () => {
        const customers = await getAllCustomers();
        return `Found ${customers.length} customers`;
      });
      
      // Test 4: Get all helpers
      await testFunction('getAllHelpers', async () => {
        const helpers = await getAllHelpers();
        return `Found ${helpers.length} helpers`;
      });
      
      // Test 5: Get helper profile
      await testFunction('getHelperProfile', async () => {
        const profile = await getHelperProfile('00000000-0000-0000-0000-000000000012');
        if (!profile) throw new Error('Helper profile not found');
        return `Found helper profile with services: ${profile.services_offered.join(', ')}`;
      });
      
      // Test 6: Get customer requests
      await testFunction('getCustomerRequests', async () => {
        const requests = await getCustomerRequests('00000000-0000-0000-0000-000000000011');
        return `Found ${requests.length} service requests`;
      });
      
      // Test 7: Direct Supabase query
      await testFunction('directSupabaseQuery', async () => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .limit(5);
          
        if (error) throw error;
        return `Direct query returned ${data.length} users`;
      });
      
      // Test 8: Auth session
      await testFunction('authSession', async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session ? `Active session for ${data.session.user.email}` : 'No active session';
      });
    } catch (error) {
      console.error('Error running integration tests:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const testFunction = async (name: string, fn: () => Promise<string>) => {
    try {
      const startTime = performance.now();
      const result = await fn();
      const endTime = performance.now();
      
      setTestResults(prev => [...prev, {
        name,
        success: true,
        result,
        time: Math.round(endTime - startTime)
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Database Integration Test</h1>
          <Button 
            onClick={runIntegrationTests}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              "Run Integration Tests"
            )}
          </Button>
        </div>
        
        <Tabs defaultValue="tests" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tests">Integration Tests</TabsTrigger>
            <TabsTrigger value="troubleshooter">Troubleshooter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle>Database Integration Tests</CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.length > 0 ? (
                  <div className="space-y-3">
                    {testResults.map((test, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md flex items-start gap-2 ${
                          test.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {test.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            test.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {test.name}
                          </h4>
                          {test.success ? (
                            <div className="flex justify-between items-center">
                              <p className="text-sm mt-1 text-green-700">{test.result}</p>
                              <span className="text-xs text-green-600">{test.time}ms</span>
                            </div>
                          ) : (
                            <p className="text-sm mt-1 text-red-700">{test.error}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tests run yet. Click "Run Integration Tests" to start.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Integration Test Information</AlertTitle>
                    <AlertDescription>
                      These tests check if your database service layer is properly integrated with your Supabase database.
                      If tests fail, use the Troubleshooter tab to diagnose and fix issues.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="troubleshooter">
            <DatabaseTroubleshooter />
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Manual Query Tester</CardTitle>
          </CardHeader>
          <CardContent>
            <ManualQueryTester />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Component for manual query testing
const ManualQueryTester = () => {
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 5");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runQuery = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Simple SQL parser to determine the operation type
      const operation = query.trim().split(' ')[0].toUpperCase();
      
      if (operation === 'SELECT') {
        const { data, error } = await supabase.rpc('run_select_query', { query_text: query });
        
        if (error) throw error;
        setResult(data);
      } else {
        throw new Error('Only SELECT queries are supported for safety reasons');
      }
    } catch (err) {
      console.error('Query error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-32 p-2 border rounded-md font-mono text-sm"
          placeholder="Enter SQL query (SELECT only)"
        />
        <Button 
          onClick={runQuery} 
          disabled={isLoading || !query.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Query...
            </>
          ) : (
            "Run Query"
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Query Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {result && (
        <div className="space-y-2">
          <h3 className="font-medium">Query Result ({result.length} rows)</h3>
          <div className="bg-gray-50 p-3 rounded-md overflow-auto max-h-60">
            <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Notice</AlertTitle>
        <AlertDescription>
          For security reasons, only SELECT queries are allowed in this tool.
          This prevents accidental data modification.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DatabaseIntegrationTest;