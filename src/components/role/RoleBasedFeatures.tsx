import React, { ReactNode } from "react";

type UserRole = "elderly" | "helper" | "caregiver" | "admin" | "all";

interface RoleBasedFeaturesProps {
  currentRole: UserRole;
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders its children based on the user's role.
 * Only renders if the current role is included in the allowedRoles array.
 */
const RoleBasedFeatures: React.FC<RoleBasedFeaturesProps> = ({
  currentRole,
  allowedRoles,
  children,
  fallback = null,
}) => {
  // Always show if "all" is in the allowed roles
  if (allowedRoles.includes("all")) {
    return <>{children}</>;
  }

  // Show if the current role is in the allowed roles
  if (allowedRoles.includes(currentRole)) {
    return <>{children}</>;
  }

  // Otherwise show the fallback (if provided)
  return <>{fallback}</>;
};

export default RoleBasedFeatures;
