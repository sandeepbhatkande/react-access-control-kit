import { useMemo } from "react";
import type { Permission } from "../types";
import {
  permissionSetHas,
  permissionSetHasAll,
  permissionSetHasAny,
} from "../core";
import { useAccessControlContext } from "./useAccessControlContext";

export function usePermission(permission: Permission): boolean {
  const { permissionSet } = useAccessControlContext();
  return useMemo(
    () => permissionSetHas(permissionSet, permission),
    [permissionSet, permission],
  );
}

export function useAnyPermission(permissions: readonly Permission[]): boolean {
  const { permissionSet } = useAccessControlContext();
  return useMemo(
    () => permissionSetHasAny(permissionSet, permissions),
    [permissionSet, permissions],
  );
}

export function useAllPermissions(permissions: readonly Permission[]): boolean {
  const { permissionSet } = useAccessControlContext();
  return useMemo(
    () => permissionSetHasAll(permissionSet, permissions),
    [permissionSet, permissions],
  );
}
