import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/lib/errorLogging';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    logError(error, this.props.context || 'ErrorBoundary');
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({ errorInfo });
    
    // Store error details in localStorage for debugging
    try {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        context: this.props.context || 'ErrorBoundary'
      });
      localStorage.setItem('app_errors', JSON.stringify(errors.slice(-10))); // Keep last 10 errors
    } catch (e) {
      console.error('Error logging to localStorage:', e);
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <div className="bg-red-50 p-3 rounded-md mb-4 overflow-auto max-h-40">
              <p className="text-red-700 font-mono text-sm">
                {this.state.error?.message}
              </p>
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="text-sm text-red-600 cursor-pointer">View component stack</summary>
                  <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
              <Button 
                variant="outline"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;