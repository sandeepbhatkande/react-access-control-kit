import type { ReactNode } from "react";
import type { AccessGuardProps } from "../types";
import { DEFAULT_MODE } from "../constants";
import { useAllPermissions, useAnyPermission } from "../hooks/usePermission";
import { useAllRoles, useAnyRole } from "../hooks/useRole";

function resolveList(
  single: string | undefined,
  many: readonly string[] | undefined,
): readonly string[] {
  if (many !== undefined) {
    return many;
  }
  if (single !== undefined) {
    return [single];
  }
  return [];
}

/**
 * Route / page guard. Renders `children` when authorized, otherwise `fallback`.
 *
 * Router-agnostic — pass your router's redirect UI as `fallback`:
 *
 * ```tsx
 * <AccessGuard role="admin" fallback={<Navigate to="/login" replace />}>
 *   <AdminPage />
 * </AccessGuard>
 * ```
 *
 * When both permission and role constraints are set, both must pass.
 */
export function AccessGuard({
  permission,
  permissions,
  role,
  roles,
  mode = DEFAULT_MODE,
  fallback = null,
  children = null,
}: AccessGuardProps): ReactNode {
  const permissionList = resolveList(permission, permissions);
  const roleList = resolveList(role, roles);

  const hasPermissionConstraint = permissionList.length > 0;
  const hasRoleConstraint = roleList.length > 0;

  const permAny = useAnyPermission(permissionList);
  const permAll = useAllPermissions(permissionList);
  const roleAny = useAnyRole(roleList);
  const roleAll = useAllRoles(roleList);

  const permissionsOk = !hasPermissionConstraint
    ? true
    : mode === "all"
      ? permAll
      : permAny;

  const rolesOk = !hasRoleConstraint
    ? true
    : mode === "all"
      ? roleAll
      : roleAny;

  // No constraints → deny (same as empty Can/Role)
  if (!hasPermissionConstraint && !hasRoleConstraint) {
    return fallback;
  }

  const allowed = permissionsOk && rolesOk;
  return allowed ? children : fallback;
}
