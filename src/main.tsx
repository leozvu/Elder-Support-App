import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import NotificationsProvider from "./components/notifications/NotificationsProvider";
import { AuthProviderComponent } from "./hooks/useAuth.tsx";
import "./lib/i18n";
import AccessibilityWrapper from "./components/accessibility/AccessibilityWrapper";
import { VoiceGuidanceProvider } from "./components/voice-guidance/VoiceGuidanceContext";
import { initVoiceGuidance } from "./lib/voice-guidance";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Initialize voice guidance
initVoiceGuidance();

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
      <AuthProviderComponent>
        <NotificationsProvider>
          <AccessibilityWrapper>
            <VoiceGuidanceProvider>
              <App />
            </VoiceGuidanceProvider>
          </AccessibilityWrapper>
        </NotificationsProvider>
      </AuthProviderComponent>
    </BrowserRouter>
  </React.StrictMode>,
);
