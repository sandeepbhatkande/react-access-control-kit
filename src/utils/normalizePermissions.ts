import type { Permission } from "../types";
import { WARNINGS } from "../constants";
import { removeDuplicates } from "./removeDuplicates";

const isDev = (): boolean =>
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/**
 * Normalize a list of permission/role strings:
 * - keep only strings
 * - trim whitespace
 * - drop empty values
 * - remove duplicates (stable order)
 */
export function normalizePermissions(
  values: readonly unknown[] | null | undefined,
  options?: { warnLabel?: "permission" | "role" },
): Permission[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const warnLabel = options?.warnLabel ?? "permission";
  const normalized: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") {
      if (isDev()) {
        console.warn(
          warnLabel === "role"
            ? WARNINGS.NON_STRING_ROLE
            : WARNINGS.NON_STRING_PERMISSION,
          value,
        );
      }
      continue;
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      if (isDev()) {
        console.warn(
          warnLabel === "role"
            ? WARNINGS.EMPTY_ROLE
            : WARNINGS.EMPTY_PERMISSION,
        );
      }
      continue;
    }

    normalized.push(trimmed);
  }

  return removeDuplicates(normalized);
}

/**
 * Alias for normalizing role lists (same rules as permissions).
 */
export function normalizeRoles(
  values: readonly unknown[] | null | undefined,
): Permission[] {
  return normalizePermissions(values, { warnLabel: "role" });
}
