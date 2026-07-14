import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { AccessControlProvider } from "../../src/provider";
import {
  useAllPermissions,
  useAllRoles,
  useAnyPermission,
  useAnyRole,
  usePermission,
  useRole,
} from "../../src/hooks";

function wrapper({ children }: { children: ReactNode }) {
  return (
    <AccessControlProvider
      permissions={["posts:read", "posts:write"]}
      roles={["editor", "viewer"]}
    >
      {children}
    </AccessControlProvider>
  );
}

describe("hooks", () => {
  it("throws outside of provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => renderHook(() => usePermission("posts:read"))).toThrow(
      /AccessControlProvider/,
    );
    spy.mockRestore();
  });

  it("usePermission / useRole", () => {
    const permission = renderHook(() => usePermission("posts:read"), {
      wrapper,
    });
    const missing = renderHook(() => usePermission("posts:delete"), {
      wrapper,
    });
    const role = renderHook(() => useRole("editor"), { wrapper });
    const missingRole = renderHook(() => useRole("admin"), { wrapper });

    expect(permission.result.current).toBe(true);
    expect(missing.result.current).toBe(false);
    expect(role.result.current).toBe(true);
    expect(missingRole.result.current).toBe(false);
  });

  it("useAny / useAll permission helpers", () => {
    const any = renderHook(
      () => useAnyPermission(["posts:delete", "posts:read"]),
      { wrapper },
    );
    const all = renderHook(
      () => useAllPermissions(["posts:read", "posts:write"]),
      { wrapper },
    );
    const allMissing = renderHook(
      () => useAllPermissions(["posts:read", "posts:delete"]),
      { wrapper },
    );

    expect(any.result.current).toBe(true);
    expect(all.result.current).toBe(true);
    expect(allMissing.result.current).toBe(false);
  });

  it("useAny / useAll role helpers", () => {
    const any = renderHook(() => useAnyRole(["admin", "editor"]), { wrapper });
    const all = renderHook(() => useAllRoles(["editor", "viewer"]), {
      wrapper,
    });
    const allMissing = renderHook(() => useAllRoles(["editor", "admin"]), {
      wrapper,
    });

    expect(any.result.current).toBe(true);
    expect(all.result.current).toBe(true);
    expect(allMissing.result.current).toBe(false);
  });
});
