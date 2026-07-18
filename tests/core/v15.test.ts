import { describe, expect, it } from "vitest";
import type { AccessState } from "../../src/types";
import {
  hasPermission,
  hasAnyPermission,
  hasRole,
  hasAnyRole,
} from "../../src/core";

describe("wildcard permissions in core", () => {
  it("hasPermission respects resource wildcards", () => {
    const state: AccessState = {
      permissions: ["posts:*"],
      roles: [],
    };
    expect(hasPermission(state, "posts:read")).toBe(true);
    expect(hasPermission(state, "posts:delete")).toBe(true);
    expect(hasPermission(state, "users:read")).toBe(false);
  });

  it("hasPermission respects global wildcard", () => {
    const state: AccessState = { permissions: ["*"], roles: [] };
    expect(hasPermission(state, "anything:goes")).toBe(true);
  });

  it("hasAnyPermission uses wildcards", () => {
    const state: AccessState = {
      permissions: ["billing:*"],
      roles: [],
    };
    expect(hasAnyPermission(state, ["posts:read", "billing:view"])).toBe(true);
  });
});

describe("role hierarchy in core", () => {
  const hierarchy = {
    admin: ["manager"],
    manager: ["user"],
  };

  const state: AccessState = {
    permissions: [],
    roles: ["admin"],
  };

  it("hasRole expands hierarchy when provided", () => {
    expect(hasRole(state, "admin", { roleHierarchy: hierarchy })).toBe(true);
    expect(hasRole(state, "manager", { roleHierarchy: hierarchy })).toBe(true);
    expect(hasRole(state, "user", { roleHierarchy: hierarchy })).toBe(true);
    expect(hasRole(state, "guest", { roleHierarchy: hierarchy })).toBe(false);
  });

  it("hasAnyRole expands hierarchy", () => {
    expect(hasAnyRole(state, ["user"], { roleHierarchy: hierarchy })).toBe(
      true,
    );
  });

  it("without hierarchy only exact roles match", () => {
    expect(hasRole(state, "manager")).toBe(false);
  });
});
