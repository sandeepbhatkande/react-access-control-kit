# react-access-control-kit

Lightweight, TypeScript-first access-control library for React 18+ with zero runtime dependencies.

- RBAC with wildcards and role hierarchy
- Feature flags
- ABAC policy engine
- Async permission loading
- SSR compatible and tree-shakeable

## Installation

```bash
npm install react-access-control-kit
```

Peer dependencies: `react` and `react-dom` ≥ 18.

## Quick Start

```tsx
import {
  AccessControlProvider,
  AccessGuard,
  Can,
  Feature,
  Policy,
  usePermission,
  useAccessStatus,
} from "react-access-control-kit";

const policies = {
  editOwnPost: ({ user, resource }) =>
    resource?.authorId === user.attributes.userId,
};

function App() {
  return (
    <AccessControlProvider
      permissions={["posts:*"]}
      roles={["admin"]}
      features={["beta-dashboard"]}
      attributes={{ userId: "u1" }}
      policies={policies}
      roleHierarchy={{ admin: ["manager"], manager: ["user"] }}
    >
      <Dashboard />
    </AccessControlProvider>
  );
}
```

### Async loading

```tsx
<AccessControlProvider
  loadAccess={async () => {
    const data = await api.getAccess();
    return {
      permissions: data.permissions,
      roles: data.roles,
      features: data.features,
      attributes: { userId: data.id },
    };
  }}
>
  <AppShell />
</AccessControlProvider>;

function AppShell() {
  const { isLoading, isError, error, reload } = useAccessStatus();
  if (isLoading) return <Spinner />;
  if (isError)
    return <button onClick={() => void reload()}>{error?.message}</button>;
  return <Routes />;
}
```

## API overview

### Provider props

| Prop                    | Description                          |
| ----------------------- | ------------------------------------ |
| `permissions` / `roles` | Sync RBAC grants                     |
| `features`              | Flag list or `{ flag: boolean }` map |
| `attributes`            | ABAC subject attributes              |
| `policies`              | Named policy functions               |
| `roleHierarchy`         | Role inheritance map                 |
| `loadAccess`            | Async loader for access snapshot     |

### Hooks

`usePermission`, `useAnyPermission`, `useAllPermissions`, `useRole`, `useAnyRole`, `useAllRoles`, `useFeature`, `useAnyFeature`, `useAllFeatures`, `usePolicy`, `useAttributes`, `useAccessStatus`

### Components

- `<Can />` / `<Role />` — permission / role gates
- `<Feature />` — feature flag gate
- `<Policy name="…" resource={…} />` — ABAC policy gate
- `<AccessGuard />` — route guard (permissions, roles, features, and/or policy)

```tsx
<AccessGuard
  permission="billing:view"
  feature="billing-v2"
  policy="engOnly"
  fallback={<Navigate to="/" replace />}
>
  <BillingPage />
</AccessGuard>
```

### Wildcards & hierarchy

- `posts:*` matches `posts:read`, `posts:write`, …
- `*` matches everything
- `roleHierarchy={{ admin: ["manager"] }}` expands inherited roles

### Policy engine (framework-agnostic)

```ts
import {
  createPolicyEngine,
  definePolicy,
  evaluatePolicy,
} from "react-access-control-kit";

const policies = {
  engOnly: definePolicy(({ user }) => user.attributes.department === "eng"),
};

const engine = createPolicyEngine(policies);
engine.evaluate("engOnly", {
  user: {
    permissions: [],
    roles: [],
    features: [],
    attributes: { department: "eng" },
  },
});
```

## Examples

- [`examples/vite-app`](./examples/vite-app)
- [`examples/nextjs-app`](./examples/nextjs-app)

## FAQ

**SSR?** Yes — no browser APIs. Call `loadAccess` only with data safe for your environment.

**Tree-shaking?** `"sideEffects": false` and ESM exports.

## Out of scope

- Multi-tenant helpers
- DevTools UI
- Built-in React Router / Next.js adapters (use `AccessGuard` + your router)

## License

MIT
