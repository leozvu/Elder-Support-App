import React, { useState, useEffect } from 'react';
import { isUsingMockData } from '@/lib/database';
import { testConnection } from '@/lib/supabase';

const DatabaseStatus = () => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  useEffect(() => {
    checkConnection();
  }, []);
  
  const checkConnection = async () => {
    setStatus('checking');
    
    try {
      const connected = await testConnection();
      setStatus(connected ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Error checking connection:', error);
      setStatus('disconnected');
    }
  };
  
  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs flex items-center">
        <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-2"></div>
        Checking database...
      </div>
    );
  }
  
  if (status === 'disconnected') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center">
        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
        Using mock data
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center">
      <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
      Database connected
    </div>
  );
};

export default DatabaseStatus;