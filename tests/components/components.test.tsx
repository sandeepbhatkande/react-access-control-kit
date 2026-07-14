import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Can, Role } from "../../src/components";
import { renderWithAccess } from "../helpers";

describe("Can", () => {
  it("renders children when permission matches", () => {
    renderWithAccess(<Can permission="posts:read">Allowed</Can>, {
      permissions: ["posts:read"],
    });
    expect(screen.getByText("Allowed")).toBeInTheDocument();
  });

  it("renders fallback when permission is missing", () => {
    renderWithAccess(
      <Can permission="posts:delete" fallback="Denied">
        Allowed
      </Can>,
      { permissions: ["posts:read"] },
    );
    expect(screen.getByText("Denied")).toBeInTheDocument();
    expect(screen.queryByText("Allowed")).not.toBeInTheDocument();
  });

  it("supports mode=all", () => {
    renderWithAccess(
      <Can permissions={["posts:read", "posts:write"]} mode="all">
        Allowed
      </Can>,
      { permissions: ["posts:read"] },
    );
    expect(screen.queryByText("Allowed")).not.toBeInTheDocument();
  });

  it("supports mode=any (default)", () => {
    renderWithAccess(
      <Can permissions={["posts:delete", "posts:read"]}>Allowed</Can>,
      { permissions: ["posts:read"] },
    );
    expect(screen.getByText("Allowed")).toBeInTheDocument();
  });

  it("renders nothing when no permission props are provided", () => {
    renderWithAccess(<Can fallback="Denied">Allowed</Can>, {
      permissions: ["posts:read"],
    });
    expect(screen.getByText("Denied")).toBeInTheDocument();
  });
});

describe("Role", () => {
  it("renders children when role matches", () => {
    renderWithAccess(<Role role="admin">Admin UI</Role>, {
      roles: ["admin"],
    });
    expect(screen.getByText("Admin UI")).toBeInTheDocument();
  });

  it("renders fallback when role is missing", () => {
    renderWithAccess(
      <Role role="admin" fallback="Guest">
        Admin UI
      </Role>,
      { roles: ["user"] },
    );
    expect(screen.getByText("Guest")).toBeInTheDocument();
  });

  it("requires all roles when mode=all", () => {
    renderWithAccess(
      <Role roles={["admin", "editor"]} mode="all" fallback="Nope">
        Both
      </Role>,
      { roles: ["admin"] },
    );
    expect(screen.getByText("Nope")).toBeInTheDocument();
  });

  it("renders for any matching role", () => {
    renderWithAccess(
      <Role roles={["admin", "editor"]} mode="any">
        Either
      </Role>,
      { roles: ["editor"] },
    );
    expect(screen.getByText("Either")).toBeInTheDocument();
  });

  it("renders nothing when no role props are provided", () => {
    renderWithAccess(<Role fallback="Denied">Allowed</Role>, {
      roles: ["admin"],
    });
    expect(screen.getByText("Denied")).toBeInTheDocument();
  });
});
