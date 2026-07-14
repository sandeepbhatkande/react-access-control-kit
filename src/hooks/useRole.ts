import { useMemo } from "react";
import type { Role } from "../types";
import { roleSetHas, roleSetHasAll, roleSetHasAny } from "../core";
import { useAccessControlContext } from "./useAccessControlContext";

export function useRole(role: Role): boolean {
  const { roleSet } = useAccessControlContext();
  return useMemo(() => roleSetHas(roleSet, role), [roleSet, role]);
}

export function useAnyRole(roles: readonly Role[]): boolean {
  const { roleSet } = useAccessControlContext();
  return useMemo(() => roleSetHasAny(roleSet, roles), [roleSet, roles]);
}

export function useAllRoles(roles: readonly Role[]): boolean {
  const { roleSet } = useAccessControlContext();
  return useMemo(() => roleSetHasAll(roleSet, roles), [roleSet, roles]);
}
