import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Database, RefreshCw } from 'lucide-react';
import { isUsingMockData } from '@/lib/database';
import { Link } from 'react-router-dom';

const DatabaseStatus = () => {
  const [usingMockData, setUsingMockData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = () => {
    setIsLoading(true);
    setUsingMockData(isUsingMockData());
    setIsLoading(false);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Database Status:</span>
            {usingMockData ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Using Mock Data
              </Badge>
            ) : (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Connected
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={checkStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/database-diagnostics">Diagnostics</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseStatus;