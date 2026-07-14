"use client";

import { Can, Role, usePermission } from "react-access-control-kit";

export function Dashboard() {
  const canDelete = usePermission("posts:delete");

  return (
    <div className="layout">
      <aside className="panel">
        <h2>Sidebar</h2>
        <nav className="nav">
          <a href="#posts">Posts</a>
          <Can permission="posts:write">
            <a href="#drafts">Drafts</a>
          </Can>
          <Can permission="users:manage">
            <a href="#users">Users</a>
          </Can>
          <Role role="admin">
            <a href="#settings">Admin settings</a>
          </Role>
        </nav>
      </aside>

      <main className="panel">
        <h2>Protected actions</h2>
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
        <Can
          permission="users:manage"
          fallback={<p className="fallback">User management unavailable.</p>}
        >
          <p className="ok">You can manage users.</p>
        </Can>
      </main>
    </div>
  );
}
