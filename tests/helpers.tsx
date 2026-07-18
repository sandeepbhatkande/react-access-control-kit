import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { AccessControlProvider } from "../src/provider";
import type { Permission, Role, RoleHierarchy } from "../src/types";

interface AccessOptions {
  permissions?: readonly Permission[];
  roles?: readonly Role[];
  roleHierarchy?: RoleHierarchy;
}

function createWrapper({
  permissions = [],
  roles = [],
  roleHierarchy,
}: AccessOptions = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AccessControlProvider
        permissions={permissions}
        roles={roles}
        roleHierarchy={roleHierarchy}
      >
        {children}
      </AccessControlProvider>
    );
  };
}

export function renderWithAccess(
  ui: ReactElement,
  access: AccessOptions = {},
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    ...options,
    wrapper: createWrapper(access),
  });
}
