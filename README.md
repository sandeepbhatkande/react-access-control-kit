# react-access-control-kit

Lightweight, TypeScript-first RBAC library for React 18+ with zero runtime dependencies.

- Tiny bundle (&lt;10 KB gzipped)
- SSR compatible
- Tree-shakeable
- Excellent DX with fully typed hooks and components

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
  Can,
  Role,
  usePermission,
} from "react-access-control-kit";

function App() {
  return (
    <AccessControlProvider
      permissions={["posts:read", "posts:write"]}
      roles={["editor"]}
    >
      <Dashboard />
    </AccessControlProvider>
  );
}

function Dashboard() {
  const canWrite = usePermission("posts:write");

  return (
    <>
      <Can permission="posts:read">
        <PostsList />
      </Can>

      <Can permission="posts:delete" fallback={<p>No delete access</p>}>
        <DeleteButton />
      </Can>

      <Role role="admin" fallback={<p>Admins only</p>}>
        <AdminPanel />
      </Role>

      {canWrite ? <CreatePostButton /> : null}
    </>
  );
}
```

## API

### `AccessControlProvider`

Stores roles and permissions and exposes them via React context.

| Prop          | Type                | Default | Description                             |
| ------------- | ------------------- | ------- | --------------------------------------- |
| `permissions` | `readonly string[]` | `[]`    | Permissions granted to the current user |
| `roles`       | `readonly string[]` | `[]`    | Roles granted to the current user       |
| `children`    | `ReactNode`         | —       | App tree                                |

Values are normalized (trimmed, empty strings removed, deduplicated). Invalid props warn in development.

### Hooks

All hooks throw if used outside `AccessControlProvider`.

| Hook                | Signature                            | Returns                               |
| ------------------- | ------------------------------------ | ------------------------------------- |
| `usePermission`     | `(permission: string) => boolean`    | Exact permission match                |
| `useAnyPermission`  | `(permissions: string[]) => boolean` | `true` if any match (empty → `false`) |
| `useAllPermissions` | `(permissions: string[]) => boolean` | `true` if all match (empty → `false`) |
| `useRole`           | `(role: string) => boolean`          | Exact role match                      |
| `useAnyRole`        | `(roles: string[]) => boolean`       | `true` if any match (empty → `false`) |
| `useAllRoles`       | `(roles: string[]) => boolean`       | `true` if all match (empty → `false`) |

### Components

#### `<Can />`

| Prop          | Type                | Default |
| ------------- | ------------------- | ------- |
| `permission`  | `string`            | —       |
| `permissions` | `readonly string[]` | —       |
| `mode`        | `"any" \| "all"`    | `"any"` |
| `fallback`    | `ReactNode`         | `null`  |
| `children`    | `ReactNode`         | `null`  |

Pass either `permission` or `permissions`. When both are set, `permissions` wins.

#### `<Role />`

Same shape as `<Can />` using `role` / `roles`.

### Core utilities (framework-agnostic)

Useful outside React (API handlers, tests, shared logic):

```ts
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasAllRoles,
} from "react-access-control-kit";

const state = {
  permissions: ["posts:read"],
  roles: ["user"],
};

hasPermission(state, "posts:read"); // true
hasAnyRole(state, ["admin", "user"]); // true
```

### Helpers

- `normalizePermissions(values)` — trim, drop empties/non-strings, dedupe
- `removeDuplicates(values)` — stable unique list
- `createPermissionMap(permissions)` — `{ [permission]: true }` map

## Examples

See:

- [`examples/vite-app`](./examples/vite-app) — Vite + React demo
- [`examples/nextjs-app`](./examples/nextjs-app) — Next.js App Router demo

Scenarios covered: Admin / Manager / User, protected sidebar, protected buttons, fallback UI.

## FAQ

**Do I need the provider?**  
Yes for hooks and components. Core `has*` helpers work without React.

**Is it SSR-safe?**  
Yes. The provider is a pure context wrapper with no browser APIs. In Next.js App Router, wrap client trees with a `"use client"` provider component.

**Will unused exports be tree-shaken?**  
Yes. The package sets `"sideEffects": false` and ships ESM.

**How large is the bundle?**  
Built output targets &lt;10 KB gzipped for the full entry.

## Out of scope (v1)

- Wildcard permissions
- Role hierarchy
- ABAC / policies
- Feature flags
- Route guards
- Async permission loading
- Multi-tenant helpers
- DevTools

## Roadmap

### v1.5

- Wildcard permissions
- Role hierarchy
- Route guards

### v2.0

- ABAC
- Feature flags
- Policy engine
- Async permission loading

## License

MIT
