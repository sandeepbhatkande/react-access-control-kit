import type { ReactNode } from "react";
import type { RoleHierarchy } from "../utils/expandRoles";

export type Permission = string;
export type Role = string;

export interface AccessState {
  permissions: readonly Permission[];
  roles: readonly Role[];
}

export type AccessMode = "any" | "all";

export type { RoleHierarchy };

export interface AccessControlContextValue {
  permissions: readonly Permission[];
  roles: readonly Role[];
  permissionSet: ReadonlySet<Permission>;
  roleSet: ReadonlySet<Role>;
  roleHierarchy?: RoleHierarchy;
}

export interface AccessControlProviderProps {
  permissions?: readonly Permission[];
  roles?: readonly Role[];
  /**
   * Role inheritance map. Example: `{ admin: ["manager"], manager: ["user"] }`
   * means admin also has manager and user.
   */
  roleHierarchy?: RoleHierarchy;
  children: ReactNode;
}

export interface CanProps {
  permission?: Permission;
  permissions?: readonly Permission[];
  mode?: AccessMode;
  fallback?: ReactNode;
  children?: ReactNode;
}

export interface RoleProps {
  role?: Role;
  roles?: readonly Role[];
  mode?: AccessMode;
  fallback?: ReactNode;
  children?: ReactNode;
}

/**
 * Router-agnostic route guard. Combine with your router's redirect component
 * in `fallback` (e.g. React Router `<Navigate />` or Next.js `redirect`).
 */
export interface AccessGuardProps {
  permission?: Permission;
  permissions?: readonly Permission[];
  role?: Role;
  roles?: readonly Role[];
  /** How to evaluate permission/role lists. Default: `"any"`. */
  mode?: AccessMode;
  fallback?: ReactNode;
  children?: ReactNode;
}
