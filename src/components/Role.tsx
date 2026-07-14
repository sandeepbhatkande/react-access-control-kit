import type { ReactNode } from "react";
import type { RoleProps } from "../types";
import { DEFAULT_MODE } from "../constants";
import { useAllRoles, useAnyRole } from "../hooks/useRole";

function resolveRoles(props: RoleProps): readonly string[] {
  if (props.roles !== undefined) {
    return props.roles;
  }
  if (props.role !== undefined) {
    return [props.role];
  }
  return [];
}

export function Role({
  role,
  roles,
  mode = DEFAULT_MODE,
  fallback = null,
  children = null,
}: RoleProps): ReactNode {
  const list = resolveRoles({ role, roles });
  const hasAny = useAnyRole(list);
  const hasAll = useAllRoles(list);
  const allowed = mode === "all" ? hasAll : hasAny;

  return allowed ? children : fallback;
}
