import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { AccessGuard } from "../../src/components";
import { renderWithAccess } from "../helpers";

describe("AccessGuard", () => {
  it("allows access by permission", () => {
    renderWithAccess(
      <AccessGuard permission="posts:read">Secret</AccessGuard>,
      { permissions: ["posts:read"] },
    );
    expect(screen.getByText("Secret")).toBeInTheDocument();
  });

  it("denies and shows fallback", () => {
    renderWithAccess(
      <AccessGuard permission="posts:delete" fallback="Denied">
        Secret
      </AccessGuard>,
      { permissions: ["posts:read"] },
    );
    expect(screen.getByText("Denied")).toBeInTheDocument();
  });

  it("supports role checks", () => {
    renderWithAccess(
      <AccessGuard role="admin" fallback="Nope">
        Admin
      </AccessGuard>,
      { roles: ["admin"] },
    );
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("requires both permission and role when both set", () => {
    renderWithAccess(
      <AccessGuard permission="posts:write" role="manager" fallback="Nope">
        Both
      </AccessGuard>,
      { permissions: ["posts:write"], roles: ["user"] },
    );
    expect(screen.getByText("Nope")).toBeInTheDocument();
  });

  it("supports mode=all for permissions", () => {
    renderWithAccess(
      <AccessGuard
        permissions={["posts:read", "posts:write"]}
        mode="all"
        fallback="Nope"
      >
        All
      </AccessGuard>,
      { permissions: ["posts:read"] },
    );
    expect(screen.getByText("Nope")).toBeInTheDocument();
  });

  it("supports mode=all for roles", () => {
    renderWithAccess(
      <AccessGuard roles={["admin", "manager"]} mode="all" fallback="Nope">
        All roles
      </AccessGuard>,
      { roles: ["admin"] },
    );
    expect(screen.getByText("Nope")).toBeInTheDocument();
  });

  it("renders fallback when no constraints are provided", () => {
    renderWithAccess(
      <AccessGuard fallback="Denied">Secret</AccessGuard>,
      { permissions: ["posts:read"], roles: ["admin"] },
    );
    expect(screen.getByText("Denied")).toBeInTheDocument();
  });

  it("supports permissions and roles arrays", () => {
    renderWithAccess(
      <AccessGuard permissions={["posts:read"]} roles={["editor"]}>
        Ok
      </AccessGuard>,
      { permissions: ["posts:read"], roles: ["editor"] },
    );
    expect(screen.getByText("Ok")).toBeInTheDocument();
  });

  it("supports wildcards via provider permissions", () => {
    renderWithAccess(
      <AccessGuard permission="posts:delete">Allowed</AccessGuard>,
      { permissions: ["posts:*"] },
    );
    expect(screen.getByText("Allowed")).toBeInTheDocument();
  });

  it("supports role hierarchy via provider", () => {
    renderWithAccess(
      <AccessGuard role="user" fallback="Nope">
        Inherited
      </AccessGuard>,
      {
        roles: ["admin"],
        roleHierarchy: { admin: ["manager"], manager: ["user"] },
      },
    );
    expect(screen.getByText("Inherited")).toBeInTheDocument();
  });
});
