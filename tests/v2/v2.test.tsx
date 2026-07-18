import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { renderHook, waitFor as waitForHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { AccessControlProvider } from "../../src/provider";
import {
  useAccessStatus,
  useAttributes,
  useFeature,
  usePolicy,
} from "../../src/hooks";
import { Feature, Policy } from "../../src/components";
import { renderWithAccess } from "../helpers";

describe("feature flags", () => {
  it("useFeature and Feature component", () => {
    renderWithAccess(<Feature feature="beta">Beta UI</Feature>, {
      features: ["beta"],
    });
    expect(screen.getByText("Beta UI")).toBeInTheDocument();

    const { result } = renderHook(() => useFeature("beta"), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AccessControlProvider features={{ beta: true, dark: false }}>
          {children}
        </AccessControlProvider>
      ),
    });
    expect(result.current).toBe(true);
  });

  it("Feature supports features list and empty fallback", () => {
    renderWithAccess(
      <Feature features={["a", "b"]} mode="all" fallback="Hidden">
        Shown
      </Feature>,
      { features: ["a"] },
    );
    expect(screen.getByText("Hidden")).toBeInTheDocument();

    renderWithAccess(<Feature fallback="None">X</Feature>, {
      features: ["beta"],
    });
    expect(screen.getByText("None")).toBeInTheDocument();
  });
});

describe("policies / ABAC", () => {
  const policies = {
    editOwn: ({
      user,
      resource,
    }: {
      user: { attributes: Record<string, unknown> };
      resource?: Record<string, unknown>;
    }) => resource?.authorId === user.attributes.userId,
  };

  it("usePolicy evaluates ABAC attributes", () => {
    const { result } = renderHook(
      () => usePolicy("editOwn", { resource: { authorId: "u1" } }),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <AccessControlProvider
            attributes={{ userId: "u1" }}
            policies={policies}
          >
            {children}
          </AccessControlProvider>
        ),
      },
    );
    expect(result.current).toBe(true);
  });

  it("Policy component renders fallback when denied", () => {
    render(
      <AccessControlProvider attributes={{ userId: "u1" }} policies={policies}>
        <Policy
          name="editOwn"
          resource={{ authorId: "other" }}
          fallback="Denied"
        >
          Allowed
        </Policy>
      </AccessControlProvider>,
    );
    expect(screen.getByText("Denied")).toBeInTheDocument();
  });

  it("useAttributes returns provider attributes", () => {
    const { result } = renderHook(() => useAttributes(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AccessControlProvider attributes={{ dept: "eng" }}>
          {children}
        </AccessControlProvider>
      ),
    });
    expect(result.current).toEqual({ dept: "eng" });
  });
});

describe("async loadAccess", () => {
  it("loads access asynchronously and exposes status", async () => {
    const loadAccess = vi.fn(async () => ({
      permissions: ["posts:read"],
      roles: ["user"],
      features: ["beta"],
      attributes: { userId: "async" },
    }));

    function Probe() {
      const status = useAccessStatus();
      const feature = useFeature("beta");
      return (
        <div>
          <span data-testid="status">{status.status}</span>
          <span data-testid="loading">{String(status.isLoading)}</span>
          <span data-testid="feature">{String(feature)}</span>
        </div>
      );
    }

    render(
      <AccessControlProvider loadAccess={loadAccess}>
        <Probe />
      </AccessControlProvider>,
    );

    expect(screen.getByTestId("status").textContent).toBe("loading");

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("ready");
    });
    expect(screen.getByTestId("feature").textContent).toBe("true");
    expect(loadAccess).toHaveBeenCalled();
  });

  it("surfaces load errors", async () => {
    const loadAccess = vi.fn(async () => {
      throw new Error("network down");
    });

    const { result } = renderHook(() => useAccessStatus(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AccessControlProvider loadAccess={loadAccess}>
          {children}
        </AccessControlProvider>
      ),
    });

    await waitForHook(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toBe("network down");
  });

  it("reload works without loader and coerces non-Error throws", async () => {
    const { result: syncStatus } = renderHook(() => useAccessStatus(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AccessControlProvider permissions={["x"]}>
          {children}
        </AccessControlProvider>
      ),
    });
    await syncStatus.current.reload();
    expect(syncStatus.current.isReady).toBe(true);

    const loadAccess = vi.fn(async () => {
      throw "boom";
    });
    const { result } = renderHook(() => useAccessStatus(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AccessControlProvider loadAccess={loadAccess}>
          {children}
        </AccessControlProvider>
      ),
    });
    await waitForHook(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toMatch(/loadAccess failed/);
  });
});
