import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getErrorLogs, clearErrorLogs } from '@/lib/errorLogging';
import { testSupabaseConnection } from '@/lib/supabase';

const Diagnostics = () => {
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [environmentInfo, setEnvironmentInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load error logs
    setErrorLogs(getErrorLogs());
    
    // Get connection status
    const savedConnectionTest = localStorage.getItem('supabaseConnectionTest');
    if (savedConnectionTest) {
      try {
        setConnectionStatus(JSON.parse(savedConnectionTest));
      } catch (e) {
        console.error('Failed to parse connection test result:', e);
      }
    }
    
    // Collect environment information
    setEnvironmentInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      memory: (performance as any).memory ? {
        jsHeapSizeLimit: formatBytes((performance as any).memory.jsHeapSizeLimit),
        totalJSHeapSize: formatBytes((performance as any).memory.totalJSHeapSize),
        usedJSHeapSize: formatBytes((performance as any).memory.usedJSHeapSize),
      } : 'Not available',
      localStorage: {
        available: isLocalStorageAvailable(),
        size: getLocalStorageSize(),
      },
      env: {
        NODE_ENV: import.meta.env.MODE,
        BASE_URL: import.meta.env.BASE_URL,
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD,
      }
    });
    
    setIsLoading(false);
  }, []);
  
  // Format bytes to human-readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  // Check if localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Get localStorage size
  const getLocalStorageSize = () => {
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
      return formatBytes(totalSize * 2); // Multiply by 2 for UTF-16 encoding
    } catch (e) {
      return 'Not available';
    }
  };
  
  // Run a new connection test
  const runConnectionTest = async () => {
    setIsLoading(true);
    const result = await testSupabaseConnection();
    setConnectionStatus(result);
    localStorage.setItem('supabaseConnectionTest', JSON.stringify(result));
    setIsLoading(false);
  };
  
  // Clear error logs
  const handleClearLogs = () => {
    clearErrorLogs();
    setErrorLogs([]);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>
      
      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Supabase Connection Status</CardTitle>
          <CardDescription>
            Tests the connection to your Supabase backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus ? (
            <div className="space-y-2">
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
            </div>
          ) : (
            <p>No connection test results available</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runConnectionTest} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Run Connection Test'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Environment Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Environment Information</CardTitle>
          <CardDescription>
            Details about your browser and system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Browser</h3>
              <p className="text-sm">{environmentInfo.userAgent}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Screen Size</h3>
                <p>{environmentInfo.screenSize?.width}x{environmentInfo.screenSize?.height}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Viewport</h3>
                <p>{environmentInfo.viewport?.width}x{environmentInfo.viewport?.height}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Online Status</h3>
                <p>{environmentInfo.onLine ? 'Online' : 'Offline'}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Language</h3>
                <p>{environmentInfo.language}</p>
              </div>
            </div>
            
            {environmentInfo.memory !== 'Not available' && (
              <div>
                <h3 className="font-medium mb-1">Memory Usage</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Heap Limit</p>
                    <p>{environmentInfo.memory?.jsHeapSizeLimit}</p>
                  </div>
                  <div>
                    <p className="font-medium">Total Heap</p>
                    <p>{environmentInfo.memory?.totalJSHeapSize}</p>
                  </div>
                  <div>
                    <p className="font-medium">Used Heap</p>
                    <p>{environmentInfo.memory?.usedJSHeapSize}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-1">Local Storage</h3>
              <p>Available: {environmentInfo.localStorage?.available ? 'Yes' : 'No'}</p>
              <p>Size: {environmentInfo.localStorage?.size}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Environment Variables</h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                <p>NODE_ENV: {environmentInfo.env?.NODE_ENV}</p>
                <p>BASE_URL: {environmentInfo.env?.BASE_URL}</p>
                <p>DEV: {String(environmentInfo.env?.DEV)}</p>
                <p>PROD: {String(environmentInfo.env?.PROD)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Error Logs */}
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
                    <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40 text-red-800">
                      {log.stack}
                    </pre>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    <p>URL: {log.url}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No error logs found</p>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleClearLogs} disabled={errorLogs.length === 0}>
            Clear Error Logs
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Diagnostics;