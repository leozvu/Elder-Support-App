import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "./components/ErrorBoundary";
import { logError } from "./lib/errorLogging";

// Wrap the entire application initialization in a try-catch
try {
  const basename = import.meta.env.BASE_URL || '';

  // Set document language based on i18n language
  const setDocumentLanguage = () => {
    try {
      const lang = localStorage.getItem("i18nextLng") || "en";
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn("Failed to set document language:", e);
      document.documentElement.lang = "en";
    }
  };

  // Call once at startup
  setDocumentLanguage();

  // Log environment information
  console.log("Environment:", {
    NODE_ENV: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    SSR: import.meta.env.SSR,
  });

  // Create root element if it doesn't exist
  let rootElement = document.getElementById("root");
  if (!rootElement) {
    console.warn("Root element not found, creating one");
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
  }

  // Render the app
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter basename={basename}>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
} catch (error) {
  // Log the error
  logError(error, 'Application Initialization');
  
  // Display a fallback UI
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; padding: 20px; text-align: center;">
      <h1 style="color: #e11d48; margin-bottom: 16px;">Application Failed to Start</h1>
      <p style="margin-bottom: 16px; max-width: 500px;">The application encountered a critical error during initialization. Please try refreshing the page or contact support if the issue persists.</p>
      <div style="background-color: #fee2e2; padding: 16px; border-radius: 8px; max-width: 600px; overflow: auto; text-align: left; margin-bottom: 16px;">
        <pre style="margin: 0; color: #b91c1c; font-family: monospace; font-size: 14px;">${error?.stack || error?.message || String(error)}</pre>
      </div>
      <button onclick="window.location.reload()" style="background-color: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px;">Refresh Page</button>
    </div>
  `;
}