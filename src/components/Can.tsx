import type { ReactNode } from "react";
import type { CanProps } from "../types";
import { DEFAULT_MODE } from "../constants";
import { useAllPermissions, useAnyPermission } from "../hooks/usePermission";

function resolvePermissions(props: CanProps): readonly string[] {
  if (props.permissions !== undefined) {
    return props.permissions;
  }
  if (props.permission !== undefined) {
    return [props.permission];
  }
  return [];
}

export function Can({
  permission,
  permissions,
  mode = DEFAULT_MODE,
  fallback = null,
  children = null,
}: CanProps): ReactNode {
  const list = resolvePermissions({ permission, permissions });
  const hasAny = useAnyPermission(list);
  const hasAll = useAllPermissions(list);
  const allowed = mode === "all" ? hasAll : hasAny;

  return allowed ? children : fallback;
}
