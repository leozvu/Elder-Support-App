import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Database, RefreshCw, ExternalLink } from 'lucide-react';
import { isUsingMockData } from '@/lib/database';
import { testDatabaseConnection } from '@/utils/databaseTest';
import { Link } from 'react-router-dom';

const DatabaseStatusDashboard = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [usingMockData, setUsingMockData] = useState(false);
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setStatus('loading');
    
    try {
      // Check if using mock data
      setUsingMockData(isUsingMockData());
      
      // Test database connection
      const result = await testDatabaseConnection();
      setConnectionResult(result);
      
      setStatus(result.success ? 'success' : 'error');
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking database status:', error);
      setStatus('error');
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status === 'loading' ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              ) : status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : status === 'error' ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Database className="h-5 w-5 text-gray-500" />
              )}
              <span className="font-medium">
                {status === 'loading' ? 'Checking...' : 
                 status === 'success' ? 'Connected' : 
                 status === 'error' ? 'Connection Error' : 
                 'Unknown'}
              </span>
            </div>
            <Badge variant={usingMockData ? "secondary" : "default"}>
              {usingMockData ? "Using Mock Data" : "Live Database"}
            </Badge>
          </div>
          
          {connectionResult && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {Object.entries(connectionResult.tableTests || {}).map(([table, result]: [string, any]) => (
                <div key={table} className="p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">{table}</span>
                    {result.hasData && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        Has Data
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {lastChecked && (
            <div className="text-xs text-gray-500 mt-2">
              Last checked: {lastChecked.toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkStatus}
          disabled={status === 'loading'}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/database-integration-test">
            Advanced Tests
            <ExternalLink className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseStatusDashboard;