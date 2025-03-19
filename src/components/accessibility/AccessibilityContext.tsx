import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings } from './AccessibilityControls';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleSimplifiedNavigation: () => void;
  toggleVoiceGuidance: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  simplifiedNavigation: false,
  voiceGuidance: {
    enabled: false,
    volume: 1,
    rate: 1,
    pitch: 1,
    voice: null,
    autoReadPageContent: false,
  }
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  toggleHighContrast: () => {},
  toggleLargeText: () => {},
  toggleSimplifiedNavigation: () => {},
  toggleVoiceGuidance: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        // Apply settings to document
        document.documentElement.classList.toggle('high-contrast', parsedSettings.highContrast);
        document.documentElement.classList.toggle('large-text', parsedSettings.largeText);
        document.documentElement.classList.toggle('simplified-nav', parsedSettings.simplifiedNavigation);
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => {
      const updated = { 
        ...prev, 
        ...newSettings,
        // Handle nested voiceGuidance object
        voiceGuidance: {
          ...prev.voiceGuidance,
          ...(newSettings.voiceGuidance || {})
        }
      };
      
      // Save to localStorage
      localStorage.setItem('accessibilitySettings', JSON.stringify(updated));
      
      // Apply settings to document
      document.documentElement.classList.toggle('high-contrast', updated.highContrast);
      document.documentElement.classList.toggle('large-text', updated.largeText);
      document.documentElement.classList.toggle('simplified-nav', updated.simplifiedNavigation);
      
      return updated;
    });
  };

  const toggleHighContrast = () => {
    updateSettings({ highContrast: !settings.highContrast });
  };

  const toggleLargeText = () => {
    updateSettings({ largeText: !settings.largeText });
  };

  const toggleSimplifiedNavigation = () => {
    updateSettings({ simplifiedNavigation: !settings.simplifiedNavigation });
  };

  const toggleVoiceGuidance = () => {
    updateSettings({ 
      voiceGuidance: { 
        ...settings.voiceGuidance, 
        enabled: !settings.voiceGuidance.enabled 
      } 
    });
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        settings, 
        updateSettings, 
        toggleHighContrast, 
        toggleLargeText, 
        toggleSimplifiedNavigation,
        toggleVoiceGuidance
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);