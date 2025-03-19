import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";

// Simple error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Simple loading indicator
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
      <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite;"></div>
      <p style="margin-top: 20px;">Loading application...</p>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
}

// Render with minimal wrapping
try {
  ReactDOM.createRoot(rootElement!).render(
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
} catch (error) {
  console.error('Failed to render application:', error);
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; padding: 20px; text-align: center;">
        <h1 style="color: #e53e3e; margin-bottom: 16px;">Application Failed to Load</h1>
        <p style="margin-bottom: 16px; max-width: 500px;">There was an error loading the application. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="background-color: #3182ce; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}