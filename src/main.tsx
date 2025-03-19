import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Set document language based on i18n language
const setDocumentLanguage = () => {
  const lang = localStorage.getItem("i18nextLng") || "en";
  document.documentElement.lang = lang;
};

// Call once at startup
setDocumentLanguage();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);