import { describe, expect, it } from "vitest";
import {
  matchPermission,
  permissionMatches,
} from "../../src/utils/matchPermission";

describe("permissionMatches", () => {
  it("matches exact permissions", () => {
    expect(permissionMatches("posts:read", "posts:read")).toBe(true);
    expect(permissionMatches("posts:read", "posts:write")).toBe(false);
  });

  it("matches resource wildcards", () => {
    expect(permissionMatches("posts:*", "posts:read")).toBe(true);
    expect(permissionMatches("posts:*", "posts:delete")).toBe(true);
    expect(permissionMatches("posts:*", "users:read")).toBe(false);
    expect(permissionMatches("posts:*", "posts")).toBe(false);
  });

  it("matches global wildcard", () => {
    expect(permissionMatches("*", "anything")).toBe(true);
  });
});

describe("matchPermission", () => {
  it("works with sets and arrays", () => {
    const set = new Set(["posts:*", "users:read"]);
    expect(matchPermission(set, "posts:write")).toBe(true);
    expect(matchPermission(set, "users:read")).toBe(true);
    expect(matchPermission(set, "billing:view")).toBe(false);
    expect(matchPermission(["*"], "x")).toBe(true);
    expect(matchPermission(["posts:read"], "users:read")).toBe(false);
  });
});
