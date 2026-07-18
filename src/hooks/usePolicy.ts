import { useMemo } from "react";
import type { AttributeMap, PolicyContext } from "../types";
import { evaluatePolicy } from "../policy";
import { useAccessControlContext } from "./useAccessControlContext";

export interface UsePolicyOptions {
  action?: string;
  resource?: AttributeMap;
  environment?: AttributeMap;
}

export function usePolicy(
  name: string,
  options: UsePolicyOptions = {},
): boolean {
  const { permissions, roles, features, attributes, policies } =
    useAccessControlContext();

  return useMemo(() => {
    const ctx: PolicyContext = {
      user: {
        permissions,
        roles,
        features,
        attributes,
      },
      action: options.action,
      resource: options.resource,
      environment: options.environment,
    };
    return evaluatePolicy(policies, name, ctx);
  }, [
    permissions,
    roles,
    features,
    attributes,
    policies,
    name,
    options.action,
    options.resource,
    options.environment,
  ]);
}

export function useAttributes(): AttributeMap {
  const { attributes } = useAccessControlContext();
  return attributes;
}

export function useAccessStatus() {
  const { status, error, reload } = useAccessControlContext();
  return {
    status,
    isLoading: status === "loading",
    isReady: status === "ready",
    isError: status === "error",
    error,
    reload,
  };
}
