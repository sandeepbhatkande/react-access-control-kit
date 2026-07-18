import type { ReactNode } from "react";
import type { AccessGuardProps } from "../types";
import { DEFAULT_MODE } from "../constants";
import { useAllPermissions, useAnyPermission } from "../hooks/usePermission";
import { useAllRoles, useAnyRole } from "../hooks/useRole";
import { useAllFeatures, useAnyFeature } from "../hooks/useFeature";
import { usePolicy } from "../hooks/usePolicy";

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
 * Supports permissions, roles, features, and named policies. When multiple
 * constraint types are set, all must pass.
 */
export function AccessGuard({
  permission,
  permissions,
  role,
  roles,
  feature,
  features,
  policy,
  action,
  resource,
  environment,
  mode = DEFAULT_MODE,
  fallback = null,
  children = null,
}: AccessGuardProps): ReactNode {
  const permissionList = resolveList(permission, permissions);
  const roleList = resolveList(role, roles);
  const featureList = resolveList(feature, features);

  const hasPermissionConstraint = permissionList.length > 0;
  const hasRoleConstraint = roleList.length > 0;
  const hasFeatureConstraint = featureList.length > 0;
  const hasPolicyConstraint = policy !== undefined;

  const permAny = useAnyPermission(permissionList);
  const permAll = useAllPermissions(permissionList);
  const roleAny = useAnyRole(roleList);
  const roleAll = useAllRoles(roleList);
  const featureAny = useAnyFeature(featureList);
  const featureAll = useAllFeatures(featureList);
  const policyOk = usePolicy(policy ?? "", {
    action,
    resource,
    environment,
  });

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

  const featuresOk = !hasFeatureConstraint
    ? true
    : mode === "all"
      ? featureAll
      : featureAny;

  // usePolicy("") returns false — only apply when constraint is set
  const policyPasses = !hasPolicyConstraint || policyOk;

  if (
    !hasPermissionConstraint &&
    !hasRoleConstraint &&
    !hasFeatureConstraint &&
    !hasPolicyConstraint
  ) {
    return fallback;
  }

  const allowed = permissionsOk && rolesOk && featuresOk && policyPasses;
  return allowed ? children : fallback;
}
