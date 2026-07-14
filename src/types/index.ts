import type { ReactNode } from "react";

export type Permission = string;
export type Role = string;

export interface AccessState {
  permissions: readonly Permission[];
  roles: readonly Role[];
}

export type AccessMode = "any" | "all";

export interface AccessControlContextValue {
  permissions: readonly Permission[];
  roles: readonly Role[];
  permissionSet: ReadonlySet<Permission>;
  roleSet: ReadonlySet<Role>;
}

export interface AccessControlProviderProps {
  permissions?: readonly Permission[];
  roles?: readonly Role[];
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
