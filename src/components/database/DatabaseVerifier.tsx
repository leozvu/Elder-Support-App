import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Database } from 'lucide-react';
import { verifyDatabaseSchema, checkDatabaseHealth, isUsingMockData, setUseMockData } from '@/lib/database';
import { supabase } from '@/lib/supabase';

const DatabaseVerifier = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [healthResult, setHealthResult] = useState<any>(null);
  const [schemaIssues, setSchemaIssues] = useState<string[]>([]);
  const [isMockData, setIsMockData] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setStatus('loading');
    
    try {
      // Check if using mock data
      setIsMockData(isUsingMockData());
      
      // Check database health
      const health = await checkDatabaseHealth();
      setHealthResult(health);
      
      if (health.connection && health.schema) {
        setStatus('success');
      } else {
        setStatus('error');
        setSchemaIssues(health.issues);
      }
    } catch (error) {
      console.error('Error checking database status:', error);
      setStatus('error');
      setSchemaIssues([error instanceof Error ? error.message : 'Unknown error']);
    }
  };

  const toggleMockData = () => {
    const newValue = !isMockData;
    setUseMockData(newValue);
    setIsMockData(newValue);
    
    // Save preference to localStorage
    localStorage.setItem('use_mock_data', newValue ? 'true' : 'false');
  };

  const fixDatabaseIssues = async () => {
    setIsFixing(true);
    
    try {
      // For demo purposes, we'll just toggle to mock data if there are issues
      if (status === 'error') {
        setUseMockData(true);
        setIsMockData(true);
        localStorage.setItem('use_mock_data', 'true');
        
        // Recheck status
        await checkStatus();
      }
    } catch (error) {
      console.error('Error fixing database issues:', error);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {status === 'loading' ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Checking database status...</p>
              </div>
            </div>
          ) : status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">Database Connected</h3>
                  <p className="text-green-700 text-sm mt-1">
                    Your database connection is working properly.
                  </p>
                  {healthResult?.latency && (
                    <p className="text-green-700 text-sm mt-1">
                      Latency: {Math.round(healthResult.latency)}ms
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">Database Issues Detected</h3>
                  <p className="text-red-700 text-sm mt-1">
                    There are issues with your database connection or schema.
                  </p>
                  {schemaIssues.length > 0 && (
                    <div className="mt-2">
                      <p className="text-red-700 text-sm font-medium">Issues:</p>
                      <ul className="list-disc pl-5 text-sm text-red-700 mt-1">
                        {schemaIssues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Mock Data Mode</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isMockData 
                    ? "Using mock data instead of database" 
                    : "Using actual database connection"}
                </p>
              </div>
              <Button 
                variant={isMockData ? "default" : "outline"} 
                onClick={toggleMockData}
              >
                {isMockData ? "Disable Mock Data" : "Enable Mock Data"}
              </Button>
            </div>
          </div>
          
          {status === 'error' && !isMockData && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Database Connection Failed</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Unable to connect to the database. You can enable mock data mode to continue using the application without a database connection.
                </p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={fixDatabaseIssues}
                  disabled={isFixing}
                >
                  {isFixing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    "Fix Issues (Use Mock Data)"
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkStatus} 
          disabled={status === 'loading'}
          className="w-full"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Database Status"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseVerifier;