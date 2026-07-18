import type { Policy, PolicyContext, PolicyMap } from "../types";

export interface PolicyEngine {
  readonly policies: PolicyMap;
  has(name: string): boolean;
  evaluate(name: string, ctx: PolicyContext): boolean;
}

/**
 * Create a reusable policy engine from a named policy map.
 */
export function createPolicyEngine(policies: PolicyMap): PolicyEngine {
  return {
    policies,
    has(name: string): boolean {
      return typeof policies[name] === "function";
    },
    evaluate(name: string, ctx: PolicyContext): boolean {
      return evaluatePolicy(policies, name, ctx);
    },
  };
}

/**
 * Evaluate a named policy. Returns `false` when the policy is missing.
 */
export function evaluatePolicy(
  policies: PolicyMap,
  name: string,
  ctx: PolicyContext,
): boolean {
  if (typeof name !== "string" || name.length === 0) {
    return false;
  }
  const policy: Policy | undefined = policies[name];
  if (!policy) {
    return false;
  }
  return Boolean(policy(ctx));
}

/**
 * Define a typed policy helper (identity function for DX).
 */
export function definePolicy(policy: Policy): Policy {
  return policy;
}
