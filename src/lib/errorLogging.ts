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
    } : 'Not available',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Defined' : 'Not defined',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Defined' : 'Not defined'
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
  
  // Report to server if available (commented out for now)
  // reportErrorToServer(error, context, environmentInfo);
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

/**
 * Check if the application is in a healthy state
 */
export function checkAppHealth() {
  const healthStatus = {
    localStorage: checkLocalStorage(),
    speechSynthesis: checkSpeechSynthesis(),
    onlineStatus: navigator.onLine,
    supabaseEnv: checkSupabaseEnv(),
    errors: getErrorLogs().length
  };
  
  return healthStatus;
}

/**
 * Check if localStorage is working
 */
function checkLocalStorage() {
  try {
    localStorage.setItem('health_check', 'ok');
    const result = localStorage.getItem('health_check') === 'ok';
    localStorage.removeItem('health_check');
    return result;
  } catch (e) {
    return false;
  }
}

/**
 * Check if speech synthesis is available
 */
function checkSpeechSynthesis() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Check if Supabase environment variables are set
 */
function checkSupabaseEnv() {
  return {
    url: !!import.meta.env.VITE_SUPABASE_URL,
    anonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
  };
}

/**
 * Create a diagnostic report for troubleshooting
 */
export function createDiagnosticReport() {
  const report = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    health: checkAppHealth(),
    errors: getErrorLogs(),
    localStorage: {
      size: getLocalStorageSize(),
      keys: Object.keys(localStorage).filter(key => !key.includes('password'))
    },
    environment: {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD
    }
  };
  
  return report;
}

/**
 * Get the size of localStorage
 */
function getLocalStorageSize() {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || '';
    const value = localStorage.getItem(key) || '';
    total += key.length + value.length;
  }
  return formatBytes(total * 2); // Multiply by 2 for UTF-16 encoding
}

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}