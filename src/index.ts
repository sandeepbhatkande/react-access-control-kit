export { AccessControlProvider } from "./provider";

export {
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useRole,
  useAnyRole,
  useAllRoles,
  useFeature,
  useAnyFeature,
  useAllFeatures,
  usePolicy,
  useAttributes,
  useAccessStatus,
} from "./hooks";

export { Can, AccessGuard, Feature, Policy } from "./components";

export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  expandRoles,
  matchPermission,
  permissionMatches,
} from "./core";

export { hasFeature, hasAnyFeature, hasAllFeatures } from "./core/features";

export { createPolicyEngine, evaluatePolicy, definePolicy } from "./policy";

export { normalizePermissions } from "./utils/normalizePermissions";
export { normalizeFeatures } from "./utils/normalizeFeatures";
export { removeDuplicates } from "./utils/removeDuplicates";
export { createPermissionMap } from "./utils/createPermissionMap";

export type {
  Permission,
  FeatureFlag,
  AccessState,
  AccessMode,
  AccessStatus,
  AccessLoadResult,
  LoadAccess,
  AttributeMap,
  PolicySubject,
  PolicyContext,
  PolicyMap,
  AccessControlProviderProps,
  CanProps,
  RoleProps,
  FeatureProps,
  PolicyGateProps,
  AccessGuardProps,
  RoleHierarchy,
} from "./types";

export type { Policy as PolicyFn } from "./types";
export type { AccessCheckOptions } from "./core";
export type { PolicyEngine } from "./policy";
export type { UsePolicyOptions } from "./hooks/usePolicy";

export { Role } from "./exports/role";
