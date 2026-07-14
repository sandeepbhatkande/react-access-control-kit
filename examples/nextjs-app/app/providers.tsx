"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AccessControlProvider } from "react-access-control-kit";

export type Persona = "admin" | "manager" | "user";

export const PERSONAS: Record<
  Persona,
  { label: string; roles: string[]; permissions: string[] }
> = {
  admin: {
    label: "Admin",
    roles: ["admin"],
    permissions: [
      "posts:read",
      "posts:write",
      "posts:delete",
      "users:manage",
      "billing:view",
    ],
  },
  manager: {
    label: "Manager",
    roles: ["manager"],
    permissions: ["posts:read", "posts:write", "billing:view"],
  },
  user: {
    label: "User",
    roles: ["user"],
    permissions: ["posts:read"],
  },
};

export function AppProviders({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>("manager");
  const access = useMemo(() => PERSONAS[persona], [persona]);

  return (
    <AccessControlProvider
      permissions={access.permissions}
      roles={access.roles}
    >
      <div className="shell">
        <header className="top">
          <div>
            <h1>react-access-control-kit</h1>
            <p>Next.js App Router example (client provider boundary).</p>
          </div>
          <div className="switch">
            {(Object.keys(PERSONAS) as Persona[]).map((key) => (
              <button
                key={key}
                type="button"
                className={persona === key ? "active" : ""}
                onClick={() => setPersona(key)}
              >
                {PERSONAS[key].label}
              </button>
            ))}
          </div>
          <p className="meta">
            Roles: {access.roles.join(", ")} · Permissions:{" "}
            {access.permissions.join(", ")}
          </p>
        </header>
        {children}
      </div>
    </AccessControlProvider>
  );
}
