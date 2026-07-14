import type { Permission } from "../types";

/**
 * Build a map of permissions to `true` for O(1) membership checks.
 */
export function createPermissionMap(
  permissions: readonly Permission[],
): Readonly<Record<Permission, true>> {
  const map: Record<string, true> = {};

  for (const permission of permissions) {
    if (typeof permission === "string" && permission.length > 0) {
      map[permission] = true;
    }
  }

  return map;
}
