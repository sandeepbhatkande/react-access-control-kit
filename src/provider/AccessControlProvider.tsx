import { useMemo, type ReactElement } from "react";
import type { AccessControlProviderProps } from "../types";
import { WARNINGS } from "../constants";
import {
  normalizePermissions,
  normalizeRoles,
} from "../utils/normalizePermissions";
import { expandRoles } from "../utils/expandRoles";
import { AccessControlContext } from "./AccessControlContext";

const isDev = (): boolean =>
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

export function AccessControlProvider({
  permissions,
  roles,
  roleHierarchy,
  children,
}: AccessControlProviderProps): ReactElement {
  const value = useMemo(() => {
    if (isDev()) {
      if (permissions !== undefined && !Array.isArray(permissions)) {
        console.warn(WARNINGS.NON_ARRAY_PERMISSIONS);
      }
      if (roles !== undefined && !Array.isArray(roles)) {
        console.warn(WARNINGS.NON_ARRAY_ROLES);
      }
    }

    const normalizedPermissions = normalizePermissions(
      Array.isArray(permissions) ? permissions : [],
    );
    const normalizedRoles = normalizeRoles(Array.isArray(roles) ? roles : []);
    const expandedRoles = expandRoles(normalizedRoles, roleHierarchy);

    return {
      permissions: normalizedPermissions,
      roles: expandedRoles,
      permissionSet: new Set(normalizedPermissions),
      roleSet: new Set(expandedRoles),
      roleHierarchy,
    };
  }, [permissions, roles, roleHierarchy]);

  return (
    <AccessControlContext.Provider value={value}>
      {children}
    </AccessControlContext.Provider>
  );
}
