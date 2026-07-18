export { AccessControlProvider } from "./provider";

export {
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useRole,
  useAnyRole,
  useAllRoles,
} from "./hooks";

export { Can, AccessGuard } from "./components";

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

export { normalizePermissions } from "./utils/normalizePermissions";
export { removeDuplicates } from "./utils/removeDuplicates";
export { createPermissionMap } from "./utils/createPermissionMap";

export type {
  Permission,
  AccessState,
  AccessMode,
  AccessControlProviderProps,
  CanProps,
  RoleProps,
  AccessGuardProps,
  RoleHierarchy,
} from "./types";

export type { AccessCheckOptions } from "./core";

export { Role } from "./exports/role";
