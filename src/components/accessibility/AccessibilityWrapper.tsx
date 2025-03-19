import React, { useEffect, useState } from 'react';

interface AccessibilityWrapperProps {
  children: React.ReactNode;
}

const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({ children }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    simplifiedNavigation: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          highContrast: parsedSettings.highContrast || false,
          largeText: parsedSettings.largeText || false,
          simplifiedNavigation: parsedSettings.simplifiedNavigation || false,
        });
        
        // Apply settings to document
        document.documentElement.classList.toggle('high-contrast', parsedSettings.highContrast);
        document.documentElement.classList.toggle('large-text', parsedSettings.largeText);
        document.documentElement.classList.toggle('simplified-nav', parsedSettings.simplifiedNavigation);
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error);
      }
    }
  }, []);

  return (
    <>
      {/* Add CSS for accessibility modes */}
      <style jsx global>{`
        /* High contrast mode */
        .high-contrast {
          --background: 0 0% 0%;
          --foreground: 0 0% 100%;
          --muted: 0 0% 15%;
          --muted-foreground: 0 0% 100%;
          --border: 0 0% 100%;
          --input: 0 0% 0%;
          
          --primary: 0 0% 100%;
          --primary-foreground: 0 0% 0%;
          
          --secondary: 0 0% 15%;
          --secondary-foreground: 0 0% 100%;
          
          --accent: 0 0% 25%;
          --accent-foreground: 0 0% 100%;
          
          --destructive: 0 100% 50%;
          --destructive-foreground: 0 0% 100%;
          
          --card: 0 0% 0%;
          --card-foreground: 0 0% 100%;
          
          --popover: 0 0% 0%;
          --popover-foreground: 0 0% 100%;
        }

        /* Large text mode */
        .large-text {
          font-size: 1.25rem;
        }

        .large-text h1 {
          font-size: 2.5rem;
        }

        .large-text h2 {
          font-size: 2rem;
        }

        .large-text h3 {
          font-size: 1.75rem;
        }

        .large-text button,
        .large-text a {
          font-size: 1.25rem;
          padding: 0.75rem 1.25rem;
        }

        /* Simplified navigation mode */
        .simplified-nav button,
        .simplified-nav a {
          margin: 0.5rem 0;
          padding: 0.75rem;
          border-radius: 0.5rem;
        }
      `}</style>
      {children}
    </>
  );
};

export default AccessibilityWrapper;