import type { ReactNode } from "react";
import type { RoleHierarchy } from "../utils/expandRoles";

export type Permission = string;
export type Role = string;
export type FeatureFlag = string;

export type AttributeMap = Readonly<Record<string, unknown>>;

export interface AccessState {
  permissions: readonly Permission[];
  roles: readonly Role[];
}

export type AccessMode = "any" | "all";

export type AccessStatus = "idle" | "loading" | "ready" | "error";

export type { RoleHierarchy };

/** Result returned by `loadAccess`. Omitted fields keep current/sync values. */
export interface AccessLoadResult {
  permissions?: readonly Permission[];
  roles?: readonly Role[];
  features?: readonly FeatureFlag[] | Readonly<Record<string, boolean>>;
  attributes?: AttributeMap;
}

export type LoadAccess = () => Promise<AccessLoadResult>;

/** Subject available to ABAC policies. */
export interface PolicySubject {
  permissions: readonly Permission[];
  roles: readonly Role[];
  features: readonly FeatureFlag[];
  attributes: AttributeMap;
}

/** Full evaluation context for a policy. */
export interface PolicyContext {
  user: PolicySubject;
  action?: string;
  resource?: AttributeMap;
  environment?: AttributeMap;
}

export type Policy = (ctx: PolicyContext) => boolean;

export type PolicyMap = Readonly<Record<string, Policy>>;

export interface AccessControlContextValue {
  permissions: readonly Permission[];
  roles: readonly Role[];
  features: readonly FeatureFlag[];
  attributes: AttributeMap;
  permissionSet: ReadonlySet<Permission>;
  roleSet: ReadonlySet<Role>;
  featureSet: ReadonlySet<FeatureFlag>;
  roleHierarchy?: RoleHierarchy;
  policies: PolicyMap;
  status: AccessStatus;
  error: Error | null;
  reload: () => Promise<void>;
}

export interface AccessControlProviderProps {
  permissions?: readonly Permission[];
  roles?: readonly Role[];
  /**
   * Enabled feature flags as a list, or a map of flag → enabled.
   */
  features?: readonly FeatureFlag[] | Readonly<Record<string, boolean>>;
  /**
   * ABAC attributes for the current user/subject (e.g. userId, department).
   */
  attributes?: AttributeMap;
  /**
   * Named policies for the policy engine / `usePolicy`.
   */
  policies?: PolicyMap;
  /**
   * Role inheritance map. Example: `{ admin: ["manager"], manager: ["user"] }`
   */
  roleHierarchy?: RoleHierarchy;
  /**
   * Async loader for permissions, roles, features, and attributes.
   * Sync props act as the initial snapshot until loading completes.
   */
  loadAccess?: LoadAccess;
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

export interface FeatureProps {
  feature?: FeatureFlag;
  features?: readonly FeatureFlag[];
  mode?: AccessMode;
  fallback?: ReactNode;
  children?: ReactNode;
}

export interface PolicyGateProps {
  name: string;
  action?: string;
  resource?: AttributeMap;
  environment?: AttributeMap;
  fallback?: ReactNode;
  children?: ReactNode;
}

export interface AccessGuardProps {
  permission?: Permission;
  permissions?: readonly Permission[];
  role?: Role;
  roles?: readonly Role[];
  feature?: FeatureFlag;
  features?: readonly FeatureFlag[];
  /** Named policy that must also pass when set. */
  policy?: string;
  action?: string;
  resource?: AttributeMap;
  environment?: AttributeMap;
  mode?: AccessMode;
  fallback?: ReactNode;
  children?: ReactNode;
}
