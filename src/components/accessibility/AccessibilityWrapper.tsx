import React, { useEffect } from "react";
import { AccessibilityProvider } from "./AccessibilityContext";

interface AccessibilityWrapperProps {
  children: React.ReactNode;
}

// Changed to function declaration for consistency with Fast Refresh
function AccessibilityWrapper({ children }: AccessibilityWrapperProps) {
  // Log that the wrapper is being rendered
  useEffect(() => {
    console.log("AccessibilityWrapper mounted - context should be available");
  }, []);

  return <AccessibilityProvider>{children}</AccessibilityProvider>;
}

export default AccessibilityWrapper;
