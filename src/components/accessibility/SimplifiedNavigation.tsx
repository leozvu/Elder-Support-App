import React, { useEffect } from 'react';

interface SimplifiedNavigationProps {
  children: React.ReactNode;
  enabled: boolean;
}

const SimplifiedNavigation: React.FC<SimplifiedNavigationProps> = ({ children, enabled }) => {
  useEffect(() => {
    // Apply simplified navigation mode to the document
    document.documentElement.classList.toggle('simplified-nav', enabled);
    
    if (enabled) {
      // Hide non-essential UI elements
      const nonEssentialElements = document.querySelectorAll('.non-essential');
      nonEssentialElements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Increase spacing between interactive elements
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(el => {
        (el as HTMLElement).style.margin = '0.5rem 0';
        (el as HTMLElement).style.padding = '0.75rem';
      });
    } else {
      // Restore non-essential UI elements
      const nonEssentialElements = document.querySelectorAll('.non-essential');
      nonEssentialElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
      
      // Reset spacing for interactive elements
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(el => {
        (el as HTMLElement).style.margin = '';
        (el as HTMLElement).style.padding = '';
      });
    }
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('simplified-nav');
      
      // Restore non-essential UI elements
      const nonEssentialElements = document.querySelectorAll('.non-essential');
      nonEssentialElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
      
      // Reset spacing for interactive elements
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(el => {
        (el as HTMLElement).style.margin = '';
        (el as HTMLElement).style.padding = '';
      });
    };
  }, [enabled]);

  return <>{children}</>;
};

export default SimplifiedNavigation;