import React, { useEffect } from "react";

interface SimplifiedNavigationProps {
  enabled: boolean;
  children: React.ReactNode;
}

const SimplifiedNavigation = ({
  enabled,
  children,
}: SimplifiedNavigationProps) => {
  useEffect(() => {
    // Apply simplified navigation mode to the document
    document.documentElement.classList.toggle("simplified-nav", enabled);

    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove("simplified-nav");
    };
  }, [enabled]);

  return <>{children}</>;
};

export default SimplifiedNavigation;
