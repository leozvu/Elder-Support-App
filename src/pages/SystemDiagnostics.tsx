import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { getErrorLogs, clearErrorLogs, createDiagnosticReport, checkAppHealth } from '@/lib/errorLogging';
import { testSupabaseConnection } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import ConnectionDiagnostic from '@/components/supabase/ConnectionDiagnostic';

const SystemDiagnostics = () => {
  const [diagnosticReport, setDiagnosticReport] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    loadDiagnosticData();
  }, []);

  const loadDiagnosticData = async () => {
    setIsLoading(true);
    
    // Get health status
    const health = checkAppHealth();
    setHealthStatus(health);
    
    // Get error logs
    setErrorLogs(getErrorLogs());
    
    // Get connection status
    const savedConnectionTest = localStorage.getItem('supabaseConnectionTest');
    if (savedConnectionTest) {
      try {
        setConnectionStatus(JSON.parse(savedConnectionTest));
      } catch (e) {
        console.error('Failed to parse connection test result:', e);
      }
    } else {
      // Run a connection test if we don't have one
      const result = await testSupabaseConnection();
      setConnectionStatus(result);
      localStorage.setItem('supabaseConnectionTest', JSON.stringify(result));
    }
    
    // Create diagnostic report
    setDiagnosticReport(createDiagnosticReport());
    
    setIsLoading(false);
  };

  const runConnectionTest = async () => {
    setIsLoading(true);
    const result = await testSupabaseConnection();
    setConnectionStatus(result);
    localStorage.setItem('supabaseConnectionTest', JSON.stringify(result));
    setIsLoading(false);
  };

  const handleClearLogs = () => {
    clearErrorLogs();
    setErrorLogs([]);
  };

  const handleFixIssues = async () => {
    setIsFixing(true);
    
    // Clear localStorage (except for essential items)
    const essentialKeys = ['user', 'accessibilitySettings', 'i18nextLng'];
    Object.keys(localStorage).forEach(key => {
      if (!essentialKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Run a new connection test
    await runConnectionTest();
    
    // Reload diagnostic data
    await loadDiagnosticData();
    
    setIsFixing(false);
  };

  const downloadDiagnosticReport = () => {
    const report = createDiagnosticReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostic-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">System Diagnostics</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={loadDiagnosticData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={downloadDiagnosticReport}>
              Download Report
            </Button>
          </div>
        </div>
        
        {/* System Health Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>System Health Overview</CardTitle>
            <CardDescription>
              Quick assessment of your application's health
            </CardDescription>
          </CardHeader>
          <CardContent>
            {healthStatus ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                  <div className={`rounded-full p-2 ${healthStatus.localStorage ? 'bg-green-100' : 'bg-red-100'}`}>
                    {healthStatus.localStorage ? 
                      <CheckCircle className="h-6 w-6 text-green-600" /> : 
                      <XCircle className="h-6 w-6 text-red-600" />
                    }
                  </div>
                  <span className="mt-2 font-medium">Local Storage</span>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                  <div className={`rounded-full p-2 ${healthStatus.speechSynthesis ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    {healthStatus.speechSynthesis ? 
                      <CheckCircle className="h-6 w-6 text-green-600" /> : 
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    }
                  </div>
                  <span className="mt-2 font-medium">Speech Synthesis</span>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                  <div className={`rounded-full p-2 ${healthStatus.onlineStatus ? 'bg-green-100' : 'bg-red-100'}`}>
                    {healthStatus.onlineStatus ? 
                      <CheckCircle className="h-6 w-6 text-green-600" /> : 
                      <XCircle className="h-6 w-6 text-red-600" />
                    }
                  </div>
                  <span className="mt-2 font-medium">Online Status</span>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                  <div className={`rounded-full p-2 ${healthStatus.errors === 0 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    {healthStatus.errors === 0 ? 
                      <CheckCircle className="h-6 w-6 text-green-600" /> : 
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    }
                  </div>
                  <span className="mt-2 font-medium">Error Logs</span>
                  {healthStatus.errors > 0 && (
                    <Badge variant="destructive" className="mt-1">{healthStatus.errors}</Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
            
            {healthStatus && (healthStatus.errors > 0 || !healthStatus.localStorage || !healthStatus.onlineStatus) && (<div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800">Issues Detected</h3>
                    <p className="text-amber-700 text-sm mt-1">
                      We've detected some issues with your application. Click the "Fix Issues" button below to attempt automatic repairs.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2 bg-amber-100 hover:bg-amber-200 border-amber-300"
                      onClick={handleFixIssues}
                      disabled={isFixing}
                    >
                      {isFixing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Fixing Issues...
                        </>
                      ) : (
                        'Fix Issues'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="connection">Supabase Connection</TabsTrigger>
            <TabsTrigger value="errors">Error Logs</TabsTrigger>
            <TabsTrigger value="details">System Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection">
            <Card>
              <CardHeader>
                <CardTitle>Supabase Connection Status</CardTitle>
                <CardDescription>
                  Tests the connection to your Supabase backend
                </CardDescription>
              </CardHeader>
              <CardContent>
                {connectionStatus ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${connectionStatus.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">
                        {connectionStatus.success ? 'Connected' : 'Connection Failed'}
                      </span>
                    </div>
                    {connectionStatus.latency && (
                      <p>Latency: {Math.round(connectionStatus.latency)}ms</p>
                    )}
                    {connectionStatus.message && (
                      <p className="text-red-600">{connectionStatus.message}</p>
                    )}
                    
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <h3 className="font-medium mb-2">Environment Variables</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between text-sm">
                          <span>VITE_SUPABASE_URL:</span>
                          <span className={healthStatus?.supabaseEnv?.url ? "text-green-500" : "text-red-500"}>
                            {healthStatus?.supabaseEnv?.url ? "✓ Defined" : "✗ Missing"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>VITE_SUPABASE_ANON_KEY:</span>
                          <span className={healthStatus?.supabaseEnv?.anonKey ? "text-green-500" : "text-red-500"}>
                            {healthStatus?.supabaseEnv?.anonKey ? "✓ Defined" : "✗ Missing"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {!connectionStatus.success && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Connection Failed</AlertTitle>
                        <AlertDescription>
                          Unable to connect to Supabase. The application will use mock data instead.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={runConnectionTest} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Run Connection Test'
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-6">
              <ConnectionDiagnostic />
            </div>
          </TabsContent>
          
          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle>Error Logs</CardTitle>
                <CardDescription>
                  Recent errors that occurred in the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errorLogs.length > 0 ? (
                  <div className="space-y-4">
                    {errorLogs.map((log, index) => (
                      <div key={index} className="border border-red-200 rounded-md p-3 bg-red-50">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{log.context}</span>
                          <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-red-600 mb-2">{log.error}</p>
                        {log.stack && (
                          <details className="mt-2">
                            <summary className="text-sm text-red-600 cursor-pointer">View stack trace</summary>
                            <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40 text-red-800 mt-2">
                              {log.stack}
                            </pre>
                          </details>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                          <p>URL: {log.url}</p>
                          {log.supabaseUrl && (
                            <p>Supabase URL: {log.supabaseUrl}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-medium">No errors found</p>
                    <p className="text-gray-500 mt-1">Your application is running smoothly</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={handleClearLogs} disabled={errorLogs.length === 0}>
                  Clear Error Logs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>System Details</CardTitle>
                <CardDescription>
                  Detailed information about your system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {diagnosticReport ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Browser Information</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm break-words">{diagnosticReport.userAgent}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Environment</h3>
                      <div className="bg-gray-50 p-3 rounded-md grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium">Mode:</p>
                          <p className="text-sm">{diagnosticReport.environment.mode}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Development:</p>
                          <p className="text-sm">{diagnosticReport.environment.dev ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Production:</p>
                          <p className="text-sm">{diagnosticReport.environment.prod ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Local Storage</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm mb-2">Size: {diagnosticReport.localStorage.size}</p>
                        <details>
                          <summary className="text-sm cursor-pointer">View stored keys ({diagnosticReport.localStorage.keys.length})</summary>
                          <div className="mt-2 max-h-40 overflow-y-auto">
                            <ul className="text-xs space-y-1 list-disc pl-5">
                              {diagnosticReport.localStorage.keys.map((key: string, index: number) => (
                                <li key={index}>{key}</li>
                              ))}
                            </ul>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SystemDiagnostics;