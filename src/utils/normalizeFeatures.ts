import type { FeatureFlag } from "../types";
import { removeDuplicates } from "./removeDuplicates";

const isDev = (): boolean =>
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/**
 * Normalize feature flags from a list or `{ flag: boolean }` map.
 */
export function normalizeFeatures(
  values:
    readonly unknown[] | Readonly<Record<string, boolean>> | null | undefined,
): FeatureFlag[] {
  if (values == null) {
    return [];
  }

  if (Array.isArray(values)) {
    const normalized: string[] = [];
    for (const value of values) {
      if (typeof value !== "string") {
        if (isDev()) {
          console.warn(
            "react-access-control-kit: skipped non-string feature flag:",
            value,
          );
        }
        continue;
      }
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        continue;
      }
      normalized.push(trimmed);
    }
    return removeDuplicates(normalized);
  }

  if (typeof values === "object") {
    const enabled: string[] = [];
    for (const [key, on] of Object.entries(values)) {
      if (on === true && key.trim().length > 0) {
        enabled.push(key.trim());
      }
    }
    return removeDuplicates(enabled);
  }

  return [];
}
