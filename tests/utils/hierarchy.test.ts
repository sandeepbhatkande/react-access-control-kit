import { describe, expect, it } from "vitest";
import { expandRoles } from "../../src/utils/expandRoles";

describe("expandRoles", () => {
  const hierarchy = {
    admin: ["manager"],
    manager: ["user"],
  };

  it("returns roles unchanged without hierarchy", () => {
    expect(expandRoles(["admin"])).toEqual(["admin"]);
  });

  it("expands inherited roles", () => {
    expect(expandRoles(["admin"], hierarchy)).toEqual([
      "admin",
      "manager",
      "user",
    ]);
  });

  it("expands one level", () => {
    expect(expandRoles(["manager"], hierarchy)).toEqual(["manager", "user"]);
  });

  it("handles cycles without infinite loops", () => {
    expect(
      expandRoles(["a"], { a: ["b"], b: ["a"] }),
    ).toEqual(["a", "b"]);
  });

  it("dedupes overlapping inheritance", () => {
    expect(expandRoles(["admin", "manager"], hierarchy)).toEqual([
      "admin",
      "manager",
      "user",
    ]);
  });
});
