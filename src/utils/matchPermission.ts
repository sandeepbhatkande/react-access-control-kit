import type { Permission } from "../types";

/**
 * Check whether a granted permission pattern matches a required permission.
 *
 * Supported patterns:
 * - exact: `posts:read` matches `posts:read`
 * - resource wildcard: `posts:*` matches `posts:read`, `posts:write`, …
 * - global wildcard: `*` matches everything
 */
export function permissionMatches(
  granted: Permission,
  required: Permission,
): boolean {
  if (granted === required) {
    return true;
  }
  if (granted === "*") {
    return true;
  }
  if (granted.endsWith(":*")) {
    const prefix = granted.slice(0, -1); // e.g. "posts:"
    return required.startsWith(prefix) && required.length > prefix.length;
  }
  return false;
}

/**
 * Check whether any granted permission matches the required permission.
 */
export function matchPermission(
  granted: ReadonlySet<Permission> | readonly Permission[],
  required: Permission,
): boolean {
  if (granted instanceof Set) {
    if (granted.has(required) || granted.has("*")) {
      return true;
    }
    for (const entry of granted) {
      if (permissionMatches(entry, required)) {
        return true;
      }
    }
    return false;
  }

  for (const entry of granted) {
    if (permissionMatches(entry, required)) {
      return true;
    }
  }
  return false;
}
