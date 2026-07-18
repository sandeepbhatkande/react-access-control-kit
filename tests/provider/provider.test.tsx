import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessControlProvider } from "../../src/provider";
import { useAccessControlContext } from "../../src/hooks";

afterEach(() => {
  vi.restoreAllMocks();
});

function Probe() {
  const ctx = useAccessControlContext();
  return (
    <div>
      <span data-testid="permissions">{ctx.permissions.join(",")}</span>
      <span data-testid="roles">{ctx.roles.join(",")}</span>
    </div>
  );
}

describe("AccessControlProvider", () => {
  it("normalizes and exposes permissions and roles", () => {
    render(
      <AccessControlProvider
        permissions={[" posts:read ", "posts:read", "posts:write"]}
        roles={["admin", "admin"]}
      >
        <Probe />
      </AccessControlProvider>,
    );

    expect(screen.getByTestId("permissions").textContent).toBe(
      "posts:read,posts:write",
    );
    expect(screen.getByTestId("roles").textContent).toBe("admin");
  });

  it("defaults to empty lists", () => {
    render(
      <AccessControlProvider>
        <Probe />
      </AccessControlProvider>,
    );

    expect(screen.getByTestId("permissions").textContent).toBe("");
    expect(screen.getByTestId("roles").textContent).toBe("");
  });

  it("warns for non-array props in development", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    render(
      <AccessControlProvider
        permissions={"bad" as unknown as string[]}
        roles={"bad" as unknown as string[]}
      >
        <Probe />
      </AccessControlProvider>,
    );

    expect(warn).toHaveBeenCalled();
    expect(screen.getByTestId("permissions").textContent).toBe("");
    expect(screen.getByTestId("roles").textContent).toBe("");
  });

  it("expands roles via roleHierarchy", () => {
    render(
      <AccessControlProvider
        roles={["admin"]}
        roleHierarchy={{ admin: ["manager"], manager: ["user"] }}
      >
        <Probe />
      </AccessControlProvider>,
    );

    expect(screen.getByTestId("roles").textContent).toBe(
      "admin,manager,user",
    );
  });
});
