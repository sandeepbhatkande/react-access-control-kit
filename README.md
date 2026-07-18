# react-access-control-kit

Lightweight, TypeScript-first RBAC library for React 18+ with zero runtime dependencies.

- Tiny bundle (&lt;10 KB gzipped)
- SSR compatible
- Tree-shakeable
- Wildcards, role hierarchy, and route guards (v1.5)

## Installation

```bash
npm install react-access-control-kit
# or
pnpm add react-access-control-kit
# or
yarn add react-access-control-kit
```

Peer dependencies: `react` and `react-dom` ≥ 18.

## Quick Start

```tsx
import {
  AccessControlProvider,
  AccessGuard,
  Can,
  Role,
  usePermission,
} from "react-access-control-kit";

const hierarchy = {
  admin: ["manager"],
  manager: ["user"],
};

function App() {
  return (
    <AccessControlProvider
      permissions={["posts:*", "users:read"]}
      roles={["admin"]}
      roleHierarchy={hierarchy}
    >
      <Dashboard />
    </AccessControlProvider>
  );
}

function Dashboard() {
  const canWrite = usePermission("posts:write"); // true via posts:*

  return (
    <>
      <Can permission="posts:read">
        <PostsList />
      </Can>

      <Role role="user" fallback={<p>Users only</p>}>
        {/* true for admin via hierarchy */}
        <UserArea />
      </Role>

      <AccessGuard
        role="admin"
        fallback={<p>Redirect / unauthorized UI</p>}
      >
        <AdminPage />
      </AccessGuard>

      {canWrite ? <CreatePostButton /> : null}
    </>
  );
}
```

## API

### `AccessControlProvider`

| Prop            | Type                               | Default | Description                                      |
| --------------- | ---------------------------------- | ------- | ------------------------------------------------ |
| `permissions`   | `readonly string[]`                | `[]`    | Permissions granted to the current user          |
| `roles`         | `readonly string[]`                | `[]`    | Roles granted to the current user                |
| `roleHierarchy` | `Record<string, readonly string[]>` | —      | Inheritance map (e.g. admin → manager → user)    |
| `children`      | `ReactNode`                        | —       | App tree                                         |

Values are normalized (trimmed, empty strings removed, deduplicated). Roles are expanded using `roleHierarchy` before checks.

### Wildcard permissions

Granted permissions may include:

| Pattern     | Matches                         |
| ----------- | ------------------------------- |
| `posts:read`| Exact match only                |
| `posts:*`   | `posts:read`, `posts:write`, …  |
| `*`         | Every permission                |

```ts
hasPermission({ permissions: ["posts:*"], roles: [] }, "posts:delete"); // true
```

### Role hierarchy

```tsx
<AccessControlProvider
  roles={["admin"]}
  roleHierarchy={{
    admin: ["manager"],
    manager: ["user"],
  }}
>
  {/* useRole("user") === true */}
</AccessControlProvider>
```

Cycles are safe (expansion stops).

### Hooks

All hooks throw if used outside `AccessControlProvider`.

| Hook                | Signature                            | Returns                                      |
| ------------------- | ------------------------------------ | -------------------------------------------- |
| `usePermission`     | `(permission: string) => boolean`    | Match (supports wildcards)                   |
| `useAnyPermission`  | `(permissions: string[]) => boolean` | `true` if any match (empty → `false`)        |
| `useAllPermissions` | `(permissions: string[]) => boolean` | `true` if all match (empty → `false`)        |
| `useRole`           | `(role: string) => boolean`          | Match (includes inherited roles)             |
| `useAnyRole`        | `(roles: string[]) => boolean`       | `true` if any match (empty → `false`)        |
| `useAllRoles`       | `(roles: string[]) => boolean`       | `true` if all match (empty → `false`)        |

### Components

#### `<Can />` / `<Role />`

| Prop          | Type                | Default |
| ------------- | ------------------- | ------- |
| `permission` / `role` | `string`    | —       |
| `permissions` / `roles` | `readonly string[]` | — |
| `mode`        | `"any" \| "all"`    | `"any"` |
| `fallback`    | `ReactNode`         | `null`  |
| `children`    | `ReactNode`         | `null`  |

#### `<AccessGuard />` (route guard)

Router-agnostic. Pass your router’s redirect as `fallback`:

```tsx
import { Navigate } from "react-router-dom";
import { AccessGuard } from "react-access-control-kit";

<AccessGuard
  permission="billing:view"
  role="manager"
  fallback={<Navigate to="/unauthorized" replace />}
>
  <BillingPage />
</AccessGuard>
```

When both permission and role constraints are set, **both** must pass. `mode` applies to each list (`"any"` / `"all"`).

### Core utilities

```ts
import {
  hasPermission,
  hasRole,
  expandRoles,
  matchPermission,
} from "react-access-control-kit";

hasPermission({ permissions: ["*"], roles: [] }, "x"); // true

hasRole(
  { permissions: [], roles: ["admin"] },
  "user",
  { roleHierarchy: { admin: ["manager"], manager: ["user"] } },
); // true

expandRoles(["admin"], { admin: ["manager"] }); // ["admin", "manager"]
```

### Helpers

- `normalizePermissions(values)` — trim, drop empties/non-strings, dedupe
- `removeDuplicates(values)` — stable unique list
- `createPermissionMap(permissions)` — `{ [permission]: true }` map
- `expandRoles(roles, hierarchy)` — flatten role inheritance
- `matchPermission(granted, required)` — wildcard-aware match

## Examples

- [`examples/vite-app`](./examples/vite-app) — Vite + React demo
- [`examples/nextjs-app`](./examples/nextjs-app) — Next.js App Router demo

## FAQ

**Do I need the provider?**  
Yes for hooks and components. Core `has*` helpers work without React.

**Is it SSR-safe?**  
Yes. No browser APIs. In Next.js App Router, use a `"use client"` provider wrapper.

**How do route guards work with Next.js?**  
Use `AccessGuard` in a client component and pass a fallback that calls `redirect()` or renders a link / unauthorized UI.

## Out of scope (still)

- ABAC / policies
- Feature flags
- Async permission loading
- Multi-tenant helpers
- DevTools

## Roadmap

### v2.0

- ABAC
- Feature flags
- Policy engine
- Async permission loading

## License

MIT
