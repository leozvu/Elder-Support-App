import React, { useEffect } from 'react';

interface LargeTextModeProps {
  children: React.ReactNode;
  enabled: boolean;
}

const LargeTextMode: React.FC<LargeTextModeProps> = ({ children, enabled }) => {
  useEffect(() => {
    // Apply large text mode to the document
    document.documentElement.classList.toggle('large-text', enabled);
    
    // Add CSS variables for large text mode
    if (enabled) {
      document.documentElement.style.setProperty('--font-size-multiplier', '1.25');
    } else {
      document.documentElement.style.removeProperty('--font-size-multiplier');
    }
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('large-text');
      document.documentElement.style.removeProperty('--font-size-multiplier');
    };
  }, [enabled]);

  return <>{children}</>;
};

export default LargeTextMode;