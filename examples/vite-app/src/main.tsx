import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AccessControlProvider,
  Can,
  Role,
  usePermission,
} from "react-access-control-kit";
import "./styles.css";

type Persona = "admin" | "manager" | "user";

const PERSONAS: Record<
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

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Sidebar</h2>
      <nav>
        <a href="#posts">Posts</a>
        <Can permission="posts:write">
          <a href="#drafts">Drafts</a>
        </Can>
        <Can permission="users:manage" fallback={null}>
          <a href="#users">Users</a>
        </Can>
        <Role role="admin">
          <a href="#settings">Admin settings</a>
        </Role>
      </nav>
    </aside>
  );
}

function Actions() {
  const canDelete = usePermission("posts:delete");

  return (
    <div className="actions">
      <Can permission="posts:read">
        <button type="button">View posts</button>
      </Can>
      <Can permission="posts:write" fallback={<em>Write locked</em>}>
        <button type="button">Create post</button>
      </Can>
      <button type="button" disabled={!canDelete}>
        Delete post
      </button>
      <Role roles={["admin", "manager"]} mode="any">
        <button type="button">Billing report</button>
      </Role>
    </div>
  );
}

function App() {
  const [persona, setPersona] = useState<Persona>("manager");
  const access = useMemo(() => PERSONAS[persona], [persona]);

  return (
    <AccessControlProvider
      permissions={access.permissions}
      roles={access.roles}
    >
      <div className="page">
        <header className="header">
          <h1>react-access-control-kit</h1>
          <p>Switch persona to see protected UI update.</p>
          <div className="persona-switch">
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
        <div className="layout">
          <Sidebar />
          <main>
            <h2>Protected actions</h2>
            <Actions />
            <Can
              permission="users:manage"
              fallback={
                <p className="fallback">User management unavailable.</p>
              }
            >
              <p className="ok">You can manage users.</p>
            </Can>
          </main>
        </div>
      </div>
    </AccessControlProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
