import type { Role } from "../types";
import { removeDuplicates } from "./removeDuplicates";

/**
 * Role hierarchy map: each key inherits the listed roles (and their ancestors).
 *
 * @example
 * ```ts
 * {
 *   admin: ["manager"],
 *   manager: ["user"],
 * }
 * // admin expands to ["admin", "manager", "user"]
 * ```
 */
export type RoleHierarchy = Readonly<Record<Role, readonly Role[]>>;

/**
 * Expand roles using a hierarchy, preserving first-seen order and detecting cycles.
 */
export function expandRoles(
  roles: readonly Role[],
  hierarchy?: RoleHierarchy | null,
): Role[] {
  if (!hierarchy || Object.keys(hierarchy).length === 0) {
    return removeDuplicates([...roles]);
  }

  const result: Role[] = [];
  const visiting = new Set<Role>();
  const visited = new Set<Role>();

  const visit = (role: Role): void => {
    if (visited.has(role)) {
      return;
    }
    if (visiting.has(role)) {
      // Cycle — stop expanding this branch
      return;
    }

    visiting.add(role);
    result.push(role);

    const inherited = hierarchy[role];
    if (inherited) {
      for (const child of inherited) {
        visit(child);
      }
    }

    visiting.delete(role);
    visited.add(role);
  };

  for (const role of roles) {
    visit(role);
  }

  return result;
}
