import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { VoiceGuidanceProvider } from "./components/voice-guidance/VoiceGuidanceProvider";

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Log to localStorage for debugging
  try {
    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    errors.push({
      message: event.error?.message || 'Unknown error',
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('app_errors', JSON.stringify(errors.slice(-10))); // Keep last 10 errors
  } catch (e) {
    console.error('Error logging to localStorage:', e);
  }
});

// Get the root element
const rootElement = document.getElementById("root");

// Render the app
try {
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  // Create the root and render
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <VoiceGuidanceProvider>
            <App />
            <Toaster />
          </VoiceGuidanceProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  
  // Hide the initial loader if it exists
  const initialLoader = document.getElementById('initial-loader');
  if (initialLoader) {
    initialLoader.style.display = 'none';
  }
} catch (error) {
  console.error('Failed to render application:', error);
  
  // Show error in the root element
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; padding: 20px; text-align: center;">
        <h1 style="color: #e53e3e; margin-bottom: 16px; font-family: sans-serif;">Application Failed to Load</h1>
        <p style="margin-bottom: 16px; max-width: 500px; font-family: sans-serif;">There was an error loading the application. Please try refreshing the page.</p>
        <div style="background-color: #fee2e2; padding: 16px; border-radius: 8px; max-width: 600px; overflow: auto; text-align: left; margin-bottom: 16px;">
          <pre style="margin: 0; color: #b91c1c; font-family: monospace; font-size: 14px;">${error instanceof Error ? error.stack || error.message : String(error)}</pre>
        </div>
        <button onclick="window.location.reload()" style="background-color: #3182ce; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: sans-serif;">
          Refresh Page
        </button>
      </div>
    `;
  }
}