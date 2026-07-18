import { describe, expect, it } from "vitest";
import {
  createPolicyEngine,
  definePolicy,
  evaluatePolicy,
} from "../../src/policy";
import type { PolicyContext } from "../../src/types";

const baseCtx = (overrides: Partial<PolicyContext> = {}): PolicyContext => ({
  user: {
    permissions: ["posts:write"],
    roles: ["editor"],
    features: ["beta"],
    attributes: { userId: "u1", department: "eng" },
  },
  ...overrides,
});

describe("policy engine", () => {
  const policies = {
    editOwnPost: definePolicy(({ user, resource }) => {
      return (
        user.permissions.includes("posts:write") &&
        resource?.authorId === user.attributes.userId
      );
    }),
    engOnly: definePolicy(({ user }) => user.attributes.department === "eng"),
  };

  it("evaluatePolicy returns true when policy passes", () => {
    expect(
      evaluatePolicy(
        policies,
        "editOwnPost",
        baseCtx({
          resource: { authorId: "u1" },
        }),
      ),
    ).toBe(true);
  });

  it("evaluatePolicy returns false when policy fails", () => {
    expect(
      evaluatePolicy(
        policies,
        "editOwnPost",
        baseCtx({
          resource: { authorId: "other" },
        }),
      ),
    ).toBe(false);
  });

  it("returns false for missing or empty policy names", () => {
    expect(evaluatePolicy(policies, "missing", baseCtx())).toBe(false);
    expect(evaluatePolicy(policies, "", baseCtx())).toBe(false);
  });

  it("createPolicyEngine wraps evaluate/has", () => {
    const engine = createPolicyEngine(policies);
    expect(engine.has("editOwnPost")).toBe(true);
    expect(engine.has("nope")).toBe(false);
    expect(engine.evaluate("engOnly", baseCtx())).toBe(true);
  });
});
