import type { AccessState, Permission, Role } from "../types";
import { ERRORS } from "../constants";
import { matchPermission } from "../utils/matchPermission";
import {
  expandRoles,
  type RoleHierarchy,
} from "../utils/expandRoles";

export type { RoleHierarchy } from "../utils/expandRoles";
export { expandRoles } from "../utils/expandRoles";
export {
  matchPermission,
  permissionMatches,
} from "../utils/matchPermission";

export interface AccessCheckOptions {
  /** Role hierarchy used when checking roles. */
  roleHierarchy?: RoleHierarchy;
}

function assertAccessState(state: AccessState): void {
  if (
    !state ||
    !Array.isArray(state.permissions) ||
    !Array.isArray(state.roles)
  ) {
    throw new TypeError(ERRORS.INVALID_ACCESS_STATE);
  }
}

function toPermissionSet(state: AccessState): ReadonlySet<Permission> {
  return new Set(state.permissions);
}

function toRoleSet(
  state: AccessState,
  options?: AccessCheckOptions,
): ReadonlySet<Role> {
  const roles = options?.roleHierarchy
    ? expandRoles(state.roles, options.roleHierarchy)
    : state.roles;
  return new Set(roles);
}

function assertNonEmptyString(
  value: unknown,
  label: string,
): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(
      `react-access-control-kit: expected a non-empty ${label} string.`,
    );
  }
}

function assertStringArray(
  values: unknown,
  label: string,
): asserts values is readonly string[] {
  if (!Array.isArray(values)) {
    throw new TypeError(
      `react-access-control-kit: expected an array of ${label}s.`,
    );
  }
}

/**
 * Check whether the access state includes a specific permission.
 * Supports wildcards: `*` and `resource:*`.
 */
export function hasPermission(
  state: AccessState,
  permission: Permission,
): boolean {
  assertAccessState(state);
  assertNonEmptyString(permission, "permission");
  return matchPermission(toPermissionSet(state), permission);
}

/**
 * Check whether the access state includes at least one of the permissions.
 * Returns `false` when `permissions` is empty.
 */
export function hasAnyPermission(
  state: AccessState,
  permissions: readonly Permission[],
): boolean {
  assertAccessState(state);
  assertStringArray(permissions, "permission");
  if (permissions.length === 0) {
    return false;
  }

  const set = toPermissionSet(state);
  return permissions.some((permission) => {
    assertNonEmptyString(permission, "permission");
    return matchPermission(set, permission);
  });
}

/**
 * Check whether the access state includes every listed permission.
 * Returns `false` when `permissions` is empty.
 */
export function hasAllPermissions(
  state: AccessState,
  permissions: readonly Permission[],
): boolean {
  assertAccessState(state);
  assertStringArray(permissions, "permission");
  if (permissions.length === 0) {
    return false;
  }

  const set = toPermissionSet(state);
  return permissions.every((permission) => {
    assertNonEmptyString(permission, "permission");
    return matchPermission(set, permission);
  });
}

/**
 * Check whether the access state includes a specific role.
 * Pass `roleHierarchy` to include inherited roles.
 */
export function hasRole(
  state: AccessState,
  role: Role,
  options?: AccessCheckOptions,
): boolean {
  assertAccessState(state);
  assertNonEmptyString(role, "role");
  return toRoleSet(state, options).has(role);
}

/**
 * Check whether the access state includes at least one of the roles.
 * Returns `false` when `roles` is empty.
 */
export function hasAnyRole(
  state: AccessState,
  roles: readonly Role[],
  options?: AccessCheckOptions,
): boolean {
  assertAccessState(state);
  assertStringArray(roles, "role");
  if (roles.length === 0) {
    return false;
  }

  const set = toRoleSet(state, options);
  return roles.some((role) => {
    assertNonEmptyString(role, "role");
    return set.has(role);
  });
}

/**
 * Check whether the access state includes every listed role.
 * Returns `false` when `roles` is empty.
 */
export function hasAllRoles(
  state: AccessState,
  roles: readonly Role[],
  options?: AccessCheckOptions,
): boolean {
  assertAccessState(state);
  assertStringArray(roles, "role");
  if (roles.length === 0) {
    return false;
  }

  const set = toRoleSet(state, options);
  return roles.every((role) => {
    assertNonEmptyString(role, "role");
    return set.has(role);
  });
}

/** Internal helpers for Set-based lookups (used by React layer). */
export function permissionSetHas(
  permissionSet: ReadonlySet<Permission>,
  permission: Permission,
): boolean {
  assertNonEmptyString(permission, "permission");
  return matchPermission(permissionSet, permission);
}

export function permissionSetHasAny(
  permissionSet: ReadonlySet<Permission>,
  permissions: readonly Permission[],
): boolean {
  assertStringArray(permissions, "permission");
  if (permissions.length === 0) {
    return false;
  }
  return permissions.some((permission) => {
    assertNonEmptyString(permission, "permission");
    return matchPermission(permissionSet, permission);
  });
}

export function permissionSetHasAll(
  permissionSet: ReadonlySet<Permission>,
  permissions: readonly Permission[],
): boolean {
  assertStringArray(permissions, "permission");
  if (permissions.length === 0) {
    return false;
  }
  return permissions.every((permission) => {
    assertNonEmptyString(permission, "permission");
    return matchPermission(permissionSet, permission);
  });
}

export function roleSetHas(roleSet: ReadonlySet<Role>, role: Role): boolean {
  assertNonEmptyString(role, "role");
  return roleSet.has(role);
}

export function roleSetHasAny(
  roleSet: ReadonlySet<Role>,
  roles: readonly Role[],
): boolean {
  assertStringArray(roles, "role");
  if (roles.length === 0) {
    return false;
  }
  return roles.some((role) => {
    assertNonEmptyString(role, "role");
    return roleSet.has(role);
  });
}

export function roleSetHasAll(
  roleSet: ReadonlySet<Role>,
  roles: readonly Role[],
): boolean {
  assertStringArray(roles, "role");
  if (roles.length === 0) {
    return false;
  }
  return roles.every((role) => {
    assertNonEmptyString(role, "role");
    return roleSet.has(role);
  });
}
