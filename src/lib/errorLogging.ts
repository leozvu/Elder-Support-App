// Error logging utility to help diagnose issues

/**
 * Log an error with additional context
 */
export function logError(error: any, context: string = 'General') {
  console.error(`[${context}] Error:`, error);
  
  // Add timestamp
  const timestamp = new Date().toISOString();
  
  // Collect browser/environment info
  const environmentInfo = {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    memory: (performance as any).memory ? {
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize
    } : 'Not available'
  };
  
  // Log detailed information
  console.error(`[${context}] Environment:`, environmentInfo);
  
  // Store in localStorage for later retrieval
  try {
    const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
    errorLogs.push({
      error: error.toString(),
      stack: error.stack,
      context,
      ...environmentInfo
    });
    // Keep only the last 10 errors to avoid filling localStorage
    if (errorLogs.length > 10) {
      errorLogs.shift();
    }
    localStorage.setItem('errorLogs', JSON.stringify(errorLogs));
  } catch (e) {
    console.error('Failed to store error log:', e);
  }
}

/**
 * Get all stored error logs
 */
export function getErrorLogs() {
  try {
    return JSON.parse(localStorage.getItem('errorLogs') || '[]');
  } catch (e) {
    console.error('Failed to retrieve error logs:', e);
    return [];
  }
}

/**
 * Clear all stored error logs
 */
export function clearErrorLogs() {
  localStorage.removeItem('errorLogs');
}