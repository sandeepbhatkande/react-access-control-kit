export { AccessControlProvider } from "./provider";

export {
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useRole,
  useAnyRole,
  useAllRoles,
} from "./hooks";

export { Can } from "./components";

export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasAllRoles,
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
} from "./types";

export { Role } from "./exports/role";
