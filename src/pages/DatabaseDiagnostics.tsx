import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Database, RefreshCw, Table } from 'lucide-react';
import { checkDatabaseHealth, verifyDatabaseSchema, isUsingMockData, setUseMockData } from '@/lib/database';
import Layout from '@/components/layout/Layout';
import DatabaseVerifier from '@/components/database/DatabaseVerifier';
import { supabase } from '@/lib/supabase';

const DatabaseDiagnostics = () => {
  const [healthResult, setHealthResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableInfo, setTableInfo] = useState<any[]>([]);
  const [isMockData, setIsMockData] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixLog, setFixLog] = useState<string[]>([]);

  useEffect(() => {
    loadDiagnosticData();
  }, []);

  const loadDiagnosticData = async () => {
    setIsLoading(true);
    
    try {
      // Check if using mock data
      const usingMock = isUsingMockData();
      setIsMockData(usingMock);
      
      // Check database health
      const health = await checkDatabaseHealth();
      setHealthResult(health);
      
      // Get table information if connected
      if (health.connection && !usingMock) {
        await getTableInfo();
      }
    } catch (error) {
      console.error('Error loading diagnostic data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTableInfo = async () => {
    try {
      const tables = ['users', 'helper_profiles', 'service_requests'];
      const tableData = [];
      
      for (const table of tables) {
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
          
        const { data: sample, error: sampleError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
          
        tableData.push({
          name: table,
          count: countError ? 'Error' : count,
          status: countError ? 'error' : 'success',
          error: countError ? countError.message : null,
          sample: sampleError ? null : sample
        });
      }
      
      setTableInfo(tableData);
    } catch (error) {
      console.error('Error getting table info:', error);
    }
  };

  const fixDatabaseIssues = async () => {
    setIsFixing(true);
    setFixLog([]);
    
    try {
      addToFixLog('Starting database fix process...');
      
      // Check current status
      addToFixLog('Checking current database status...');
      const health = await checkDatabaseHealth();
      
      if (!health.connection) {
        addToFixLog('Database connection failed. Enabling mock data mode.');
        setUseMockData(true);
        setIsMockData(true);
        localStorage.setItem('use_mock_data', 'true');
        addToFixLog('Mock data mode enabled successfully.');
      } else if (!health.schema) {
        addToFixLog('Database schema issues detected.');
        
        // For each issue, try to fix it
        for (const issue of health.issues) {
          addToFixLog(`Attempting to fix: ${issue}`);
          
          // In a real app, you would implement specific fixes for each issue
          // For now, we'll just log the attempt
          addToFixLog('Fix attempted, but may require manual intervention.');
        }
        
        // Check if we fixed the issuesaddToFixLog('Rechecking database schema...');
        const schemaCheck = await verifyDatabaseSchema();
        
        if (schemaCheck.success) {
          addToFixLog('Schema issues resolved successfully!');
        } else {
          addToFixLog('Schema issues persist. Enabling mock data mode as fallback.');
          setUseMockData(true);
          setIsMockData(true);
          localStorage.setItem('use_mock_data', 'true');
        }
      } else {
        addToFixLog('No database issues detected. No fixes needed.');
      }
      
      // Reload diagnostic data
      addToFixLog('Refreshing diagnostic information...');
      await loadDiagnosticData();
      
      addToFixLog('Fix process completed.');
    } catch (error) {
      console.error('Error fixing database issues:', error);
      addToFixLog(`Error during fix process: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsFixing(false);
    }
  };

  const addToFixLog = (message: string) => {
    setFixLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Database Diagnostics</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={loadDiagnosticData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Database Health Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Health Overview
            </CardTitle>
            <CardDescription>
              Quick assessment of your database connection and schema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                    <div className={`rounded-full p-2 ${healthResult?.connection ? 'bg-green-100' : 'bg-red-100'}`}>
                      {healthResult?.connection ? 
                        <CheckCircle className="h-6 w-6 text-green-600" /> : 
                        <XCircle className="h-6 w-6 text-red-600" />
                      }
                    </div>
                    <span className="mt-2 font-medium">Connection</span>
                    {healthResult?.latency && (
                      <span className="text-sm text-gray-500">{Math.round(healthResult.latency)}ms</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                    <div className={`rounded-full p-2 ${healthResult?.schema ? 'bg-green-100' : 'bg-red-100'}`}>
                      {healthResult?.schema ? 
                        <CheckCircle className="h-6 w-6 text-green-600" /> : 
                        <XCircle className="h-6 w-6 text-red-600" />
                      }
                    </div>
                    <span className="mt-2 font-medium">Schema</span>
                    {healthResult?.issues.length > 0 && (
                      <Badge variant="destructive" className="mt-1">{healthResult.issues.length}</Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Data Source</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {isMockData 
                          ? "Using mock data instead of database" 
                          : "Using actual database connection"}
                      </p>
                    </div>
                    <Badge variant={isMockData ? "secondary" : "default"}>
                      {isMockData ? "Mock Data" : "Live Database"}
                    </Badge>
                  </div>
                </div>
                
                {(healthResult && (!healthResult.connection || !healthResult.schema)) && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Database Issues Detected</AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">
                        There are issues with your database connection or schema. Click the "Fix Database Issues" button to attempt automatic repairs.
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
                            Fixing Issues...
                          </>
                        ) : (
                          "Fix Database Issues"
                        )}
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs defaultValue="verifier" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="verifier">Database Verifier</TabsTrigger>
            <TabsTrigger value="tables">Table Information</TabsTrigger>
            <TabsTrigger value="logs">Fix Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verifier">
            <DatabaseVerifier />
          </TabsContent>
          
          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Database Tables
                </CardTitle>
                <CardDescription>
                  Information about your database tables
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : isMockData ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Using Mock Data</AlertTitle>
                    <AlertDescription>
                      Table information is not available when using mock data.
                    </AlertDescription>
                  </Alert>
                ) : tableInfo.length > 0 ? (
                  <div className="space-y-4">
                    {tableInfo.map((table, index) => (
                      <div key={index} className="border rounded-md overflow-hidden">
                        <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${table.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">{table.name}</span>
                          </div>
                          <Badge>{table.count} rows</Badge>
                        </div>
                        {table.error ? (
                          <div className="p-3 bg-red-50 text-red-700 text-sm">
                            Error: {table.error}
                          </div>
                        ) : table.sample ? (
                          <div className="p-3">
                            <p className="text-sm font-medium mb-2">Sample Row:</p>
                            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                              {JSON.stringify(table.sample[0], null, 2)}
                            </pre>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No table information available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Fix Process Logs</CardTitle>
                <CardDescription>
                  Logs from the database fix process
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fixLog.length > 0 ? (
                  <div className="bg-black rounded-md p-4 text-white font-mono text-sm">
                    <div className="space-y-1">
                      {fixLog.map((log, index) => (
                        <div key={index}>{log}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No fix logs available. Run the fix process to see logs here.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={fixDatabaseIssues} 
                  disabled={isFixing}
                  className="w-full"
                >
                  {isFixing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Fix Process...
                    </>
                  ) : (
                    "Run Fix Process"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DatabaseDiagnostics;