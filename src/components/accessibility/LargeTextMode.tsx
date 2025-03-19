import React, { useEffect } from "react";

interface LargeTextModeProps {
  enabled: boolean;
  children: React.ReactNode;
}

const LargeTextMode = ({ enabled, children }: LargeTextModeProps) => {
  useEffect(() => {
    // Apply large text mode to the document
    document.documentElement.classList.toggle("large-text", enabled);

    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove("large-text");
    };
  }, [enabled]);

  return <>{children}</>;
};

export default LargeTextMode;
