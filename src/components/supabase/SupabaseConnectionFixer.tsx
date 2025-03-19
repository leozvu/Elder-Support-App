import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { testSupabaseConnection } from '@/lib/supabase';

const SupabaseConnectionFixer = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isFixing, setIsFixing] = useState(false);

  const handleTest = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setMessage('Please enter both Supabase URL and Anon Key');
      setStatus('error');
      return;
    }

    setStatus('testing');
    setMessage('');

    try {
      // Store the values temporarily for testing
      localStorage.setItem('temp_supabase_url', supabaseUrl);
      localStorage.setItem('temp_supabase_key', supabaseKey);

      // Test the connection
      const result = await testSupabaseConnection();

      if (result.success) {
        setStatus('success');
        setMessage('Connection successful! You can now use these credentials.');
      } else {
        setStatus('error');
        setMessage(`Connection failed: ${result.message}`);
      }

      // Clean up temporary values
      localStorage.removeItem('temp_supabase_url');
      localStorage.removeItem('temp_supabase_key');
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Clean up temporary values
      localStorage.removeItem('temp_supabase_url');
      localStorage.removeItem('temp_supabase_key');
    }
  };

  const handleReset = () => {
    // Clear any stored connection test results
    localStorage.removeItem('supabaseConnectionTest');
    
    // Reset the form
    setSupabaseUrl('');
    setSupabaseKey('');
    setStatus('idle');
    setMessage('');
  };

  const handleFixCommonIssues = async () => {
    setIsFixing(true);
    
    try {
      // Clear cached data
      localStorage.removeItem('supabaseConnectionTest');
      
      // Clear any error logs related to Supabase
      const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      const filteredLogs = errorLogs.filter((log: any) => 
        !log.context.includes('Supabase') && !log.error.includes('Supabase')
      );
      localStorage.setItem('errorLogs', JSON.stringify(filteredLogs));
      
      // Force a new connection test
      const result = await testSupabaseConnection();
      
      if (result.success) {
        setStatus('success');
        setMessage('Connection issues fixed successfully!');
      } else {
        setStatus('error');
        setMessage(`Automatic fix failed: ${result.message}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Error during fix: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Fixer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Issues</AlertTitle>
            <AlertDescription>
              If you're experiencing connection issues with Supabase, you can try the automatic fix or manually update your credentials.
            </AlertDescription>
          </Alert>
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium mb-4">Automatic Fix</h3>
            <p className="text-sm mb-4">
              This will attempt to fix common connection issues by clearing cached data and testing the connection again.
            </p>
            <Button 
              onClick={handleFixCommonIssues} 
              disabled={isFixing}
              className="w-full"
            >
              {isFixing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fixing Issues...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Fix Common Issues
                </>
              )}
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Manual Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supabase-url">Supabase URL</Label>
                <Input
                  id="supabase-url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supabase-key">Supabase Anon Key</Label>
                <Input
                  id="supabase-key"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="your-anon-key"
                  type="password"
                />
              </div>
            </div>
          </div>
          
          {message && (
            <Alert variant={status === 'success' ? 'default' : 'destructive'}>
              {status === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle>{status === 'success' ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button 
          onClick={handleTest} 
          disabled={status === 'testing' || !supabaseUrl || !supabaseKey}
        >
          {status === 'testing' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionFixer;