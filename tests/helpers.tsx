import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { AccessControlProvider } from "../src/provider";
import type {
  AttributeMap,
  FeatureFlag,
  Permission,
  PolicyMap,
  Role,
  RoleHierarchy,
} from "../src/types";

interface AccessOptions {
  permissions?: readonly Permission[];
  roles?: readonly Role[];
  features?: readonly FeatureFlag[] | Readonly<Record<string, boolean>>;
  attributes?: AttributeMap;
  policies?: PolicyMap;
  roleHierarchy?: RoleHierarchy;
}

function createWrapper({
  permissions = [],
  roles = [],
  features,
  attributes,
  policies,
  roleHierarchy,
}: AccessOptions = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AccessControlProvider
        permissions={permissions}
        roles={roles}
        features={features}
        attributes={attributes}
        policies={policies}
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
