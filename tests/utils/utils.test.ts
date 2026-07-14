import { describe, expect, it, vi, afterEach } from "vitest";
import {
  normalizePermissions,
  normalizeRoles,
} from "../../src/utils/normalizePermissions";
import { removeDuplicates } from "../../src/utils/removeDuplicates";
import { createPermissionMap } from "../../src/utils/createPermissionMap";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("removeDuplicates", () => {
  it("preserves order and removes duplicates", () => {
    expect(removeDuplicates(["a", "b", "a", "c", "b"])).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(removeDuplicates([])).toEqual([]);
  });
});

describe("normalizePermissions", () => {
  it("trims, filters empties, and dedupes", () => {
    expect(
      normalizePermissions([" posts:read ", "", "posts:write", "posts:read"]),
    ).toEqual(["posts:read", "posts:write"]);
  });

  it("returns empty array for non-array input", () => {
    expect(normalizePermissions(null)).toEqual([]);
    expect(normalizePermissions(undefined)).toEqual([]);
  });

  it("skips non-string values with a warning in development", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(normalizePermissions(["ok", 1 as unknown as string, "  "])).toEqual([
      "ok",
    ]);
    expect(warn).toHaveBeenCalled();
  });

  it("normalizeRoles uses role warning label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(normalizeRoles([123 as unknown as string, "  "])).toEqual([]);
    expect(warn.mock.calls.some((call) => String(call[0]).match(/role/i))).toBe(
      true,
    );
  });
});

describe("createPermissionMap", () => {
  it("creates a membership map", () => {
    expect(createPermissionMap(["a", "b", ""])).toEqual({
      a: true,
      b: true,
    });
  });
});
