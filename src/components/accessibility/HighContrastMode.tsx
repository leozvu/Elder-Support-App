import React, { useEffect } from 'react';

interface HighContrastModeProps {
  children: React.ReactNode;
  enabled: boolean;
}

const HighContrastMode: React.FC<HighContrastModeProps> = ({ children, enabled }) => {
  useEffect(() => {
    // Apply high contrast mode to the document
    document.documentElement.classList.toggle('high-contrast', enabled);
    
    // Add CSS variables for high contrast mode
    if (enabled) {
      document.documentElement.style.setProperty('--background', '#000000');
      document.documentElement.style.setProperty('--foreground', '#ffffff');
      document.documentElement.style.setProperty('--muted', '#333333');
      document.documentElement.style.setProperty('--muted-foreground', '#ffffff');
      document.documentElement.style.setProperty('--border', '#ffffff');
      document.documentElement.style.setProperty('--input', '#000000');
    } else {
      // Reset to default theme
      document.documentElement.style.removeProperty('--background');
      document.documentElement.style.removeProperty('--foreground');
      document.documentElement.style.removeProperty('--muted');
      document.documentElement.style.removeProperty('--muted-foreground');
      document.documentElement.style.removeProperty('--border');
      document.documentElement.style.removeProperty('--input');
    }
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('high-contrast');
      document.documentElement.style.removeProperty('--background');
      document.documentElement.style.removeProperty('--foreground');
      document.documentElement.style.removeProperty('--muted');
      document.documentElement.style.removeProperty('--muted-foreground');
      document.documentElement.style.removeProperty('--border');
      document.documentElement.style.removeProperty('--input');
    };
  }, [enabled]);

  return <>{children}</>;
};

export default HighContrastMode;