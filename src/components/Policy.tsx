import type { ReactNode } from "react";
import type { PolicyGateProps } from "../types";
import { usePolicy } from "../hooks/usePolicy";

/**
 * Render children when a named ABAC policy passes.
 */
export function Policy({
  name,
  action,
  resource,
  environment,
  fallback = null,
  children = null,
}: PolicyGateProps): ReactNode {
  const allowed = usePolicy(name, { action, resource, environment });
  return allowed ? children : fallback;
}
