import React, { useEffect } from "react";

interface HighContrastModeProps {
  enabled: boolean;
  children: React.ReactNode;
}

const HighContrastMode = ({ enabled, children }: HighContrastModeProps) => {
  useEffect(() => {
    // Apply high contrast mode to the document
    document.documentElement.classList.toggle("high-contrast", enabled);

    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove("high-contrast");
    };
  }, [enabled]);

  return <>{children}</>;
};

export default HighContrastMode;
