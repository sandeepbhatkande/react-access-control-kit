import { describe, expect, it } from "vitest";
import type { AccessState } from "../../src/types";
import {
  hasAllPermissions,
  hasAllRoles,
  hasAnyPermission,
  hasAnyRole,
  hasPermission,
  hasRole,
} from "../../src/core";

const state: AccessState = {
  permissions: ["posts:read", "posts:write", "users:read"],
  roles: ["admin", "editor"],
};

describe("hasPermission", () => {
  it("returns true when permission exists", () => {
    expect(hasPermission(state, "posts:read")).toBe(true);
  });

  it("returns false when permission is missing", () => {
    expect(hasPermission(state, "posts:delete")).toBe(false);
  });

  it("throws for invalid access state", () => {
    expect(() =>
      hasPermission(null as unknown as AccessState, "posts:read"),
    ).toThrow(/AccessState/);
  });

  it("throws for empty permission", () => {
    expect(() => hasPermission(state, "")).toThrow(/non-empty permission/);
  });
});

describe("hasAnyPermission", () => {
  it("returns true when any permission matches", () => {
    expect(hasAnyPermission(state, ["posts:delete", "posts:read"])).toBe(true);
  });

  it("returns false when none match", () => {
    expect(hasAnyPermission(state, ["posts:delete", "users:write"])).toBe(
      false,
    );
  });

  it("returns false for empty list", () => {
    expect(hasAnyPermission(state, [])).toBe(false);
  });

  it("throws for non-array input", () => {
    expect(() =>
      hasAnyPermission(state, "posts:read" as unknown as string[]),
    ).toThrow(/array of permissions/);
  });

  it("throws for empty string entry", () => {
    expect(() => hasAnyPermission(state, [""])).toThrow(/non-empty permission/);
  });
});

describe("hasAllPermissions", () => {
  it("returns true when all permissions match", () => {
    expect(hasAllPermissions(state, ["posts:read", "users:read"])).toBe(true);
  });

  it("returns false when any permission is missing", () => {
    expect(hasAllPermissions(state, ["posts:read", "posts:delete"])).toBe(
      false,
    );
  });

  it("returns false for empty list", () => {
    expect(hasAllPermissions(state, [])).toBe(false);
  });
});

describe("hasRole", () => {
  it("returns true when role exists", () => {
    expect(hasRole(state, "admin")).toBe(true);
  });

  it("returns false when role is missing", () => {
    expect(hasRole(state, "viewer")).toBe(false);
  });

  it("throws for empty role", () => {
    expect(() => hasRole(state, "")).toThrow(/non-empty role/);
  });
});

describe("hasAnyRole", () => {
  it("returns true when any role matches", () => {
    expect(hasAnyRole(state, ["viewer", "admin"])).toBe(true);
  });

  it("returns false when none match", () => {
    expect(hasAnyRole(state, ["viewer", "guest"])).toBe(false);
  });

  it("returns false for empty list", () => {
    expect(hasAnyRole(state, [])).toBe(false);
  });

  it("throws for non-array input", () => {
    expect(() => hasAnyRole(state, "admin" as unknown as string[])).toThrow(
      /array of roles/,
    );
  });
});

describe("hasAllRoles", () => {
  it("returns true when all roles match", () => {
    expect(hasAllRoles(state, ["admin", "editor"])).toBe(true);
  });

  it("returns false when any role is missing", () => {
    expect(hasAllRoles(state, ["admin", "viewer"])).toBe(false);
  });

  it("returns false for empty list", () => {
    expect(hasAllRoles(state, [])).toBe(false);
  });

  it("throws for empty string entry", () => {
    expect(() => hasAllRoles(state, [""])).toThrow(/non-empty role/);
  });
});
