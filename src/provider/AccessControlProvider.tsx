import { useMemo, type ReactElement } from "react";
import type { AccessControlProviderProps } from "../types";
import { WARNINGS } from "../constants";
import {
  normalizePermissions,
  normalizeRoles,
} from "../utils/normalizePermissions";
import { AccessControlContext } from "./AccessControlContext";

const isDev = (): boolean =>
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

export function AccessControlProvider({
  permissions,
  roles,
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

    return {
      permissions: normalizedPermissions,
      roles: normalizedRoles,
      permissionSet: new Set(normalizedPermissions),
      roleSet: new Set(normalizedRoles),
    };
  }, [permissions, roles]);

  return (
    <AccessControlContext.Provider value={value}>
      {children}
    </AccessControlContext.Provider>
  );
}
