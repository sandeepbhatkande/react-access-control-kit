import { describe, expect, it } from "vitest";
import {
  permissionSetHas,
  permissionSetHasAll,
  permissionSetHasAny,
  roleSetHas,
  roleSetHasAll,
  roleSetHasAny,
} from "../../src/core";

describe("Set helpers", () => {
  const permissions = new Set(["a", "b"]);
  const roles = new Set(["admin", "editor"]);

  it("permissionSetHas*", () => {
    expect(permissionSetHas(permissions, "a")).toBe(true);
    expect(permissionSetHasAny(permissions, ["c", "a"])).toBe(true);
    expect(permissionSetHasAny(permissions, [])).toBe(false);
    expect(permissionSetHasAll(permissions, ["a", "b"])).toBe(true);
    expect(permissionSetHasAll(permissions, ["a", "c"])).toBe(false);
    expect(permissionSetHasAll(permissions, [])).toBe(false);
  });

  it("roleSetHas*", () => {
    expect(roleSetHas(roles, "admin")).toBe(true);
    expect(roleSetHasAny(roles, ["viewer", "admin"])).toBe(true);
    expect(roleSetHasAny(roles, [])).toBe(false);
    expect(roleSetHasAll(roles, ["admin", "editor"])).toBe(true);
    expect(roleSetHasAll(roles, ["admin", "viewer"])).toBe(false);
    expect(roleSetHasAll(roles, [])).toBe(false);
  });
});
