import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { testSupabaseConnection } from '@/lib/supabase';

const ConnectionTest = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setStatus('loading');
    try {
      const connectionResult = await testSupabaseConnection();
      setResult(connectionResult);
      setStatus(connectionResult.success ? 'success' : 'error');
      
      // Save the result to localStorage for other components to use
      localStorage.setItem('supabaseConnectionTest', JSON.stringify(connectionResult));
    } catch (error) {
      console.error('Connection test failed:', error);
      setStatus('error');
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {status === 'idle' && (
            <div className="text-gray-500 mb-4">
              Click the button below to test your connection to Supabase
            </div>
          )}
          
          {status === 'loading' && (
            <div className="flex flex-col items-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
              <p>Testing connection...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-green-600 font-medium">Connection successful!</p>
              {result?.latency && (
                <p className="text-sm text-gray-500 mt-1">Latency: {Math.round(result.latency)}ms</p>
              )}
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center mb-4">
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
              <p className="text-red-600 font-medium">Connection failed</p>
              {result?.message && (
                <p className="text-sm text-red-500 mt-1">{result.message}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={runTest} 
          disabled={status === 'loading'}
          variant={status === 'error' ? 'destructive' : 'default'}
          className="w-full max-w-xs"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : status === 'success' ? (
            'Test Again'
          ) : status === 'error' ? (
            'Retry Connection Test'
          ) : (
            'Run Connection Test'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectionTest;