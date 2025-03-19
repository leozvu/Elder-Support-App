import React, { useEffect } from 'react';

interface AccessibilityWrapperProps {
  children: React.ReactNode;
}

const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({ children }) => {
  // Apply accessibility settings from localStorage on mount
  useEffect(() => {
    const applySettings = () => {
      try {
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          
          // Apply settings to document
          document.documentElement.classList.toggle('high-contrast', parsedSettings.highContrast || false);
          document.documentElement.classList.toggle('large-text', parsedSettings.largeText || false);
          document.documentElement.classList.toggle('simplified-nav', parsedSettings.simplifiedNavigation || false);
        }
      } catch (error) {
        console.error('Failed to apply accessibility settings:', error);
      }
    };
    
    // Apply settings on mount
    applySettings();
    
    // Listen for storage events to update settings when changed
    window.addEventListener('storage', applySettings);
    
    return () => {
      window.removeEventListener('storage', applySettings);
    };
  }, []);

  return <>{children}</>;
};

export default AccessibilityWrapper;