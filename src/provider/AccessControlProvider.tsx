import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import type {
  AccessControlProviderProps,
  AccessLoadResult,
  AccessStatus,
  AttributeMap,
  FeatureFlag,
  Permission,
  PolicyMap,
  Role,
} from "../types";
import { WARNINGS } from "../constants";
import {
  normalizePermissions,
  normalizeRoles,
} from "../utils/normalizePermissions";
import { normalizeFeatures } from "../utils/normalizeFeatures";
import { expandRoles } from "../utils/expandRoles";
import { AccessControlContext } from "./AccessControlContext";

const isDev = (): boolean =>
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

const EMPTY_POLICIES: PolicyMap = {};

interface Snapshot {
  permissions: Permission[];
  roles: Role[];
  features: FeatureFlag[];
  attributes: AttributeMap;
}

function buildSnapshot(input: {
  permissions?: readonly Permission[];
  roles?: readonly Role[];
  features?: readonly FeatureFlag[] | Readonly<Record<string, boolean>>;
  attributes?: AttributeMap;
  roleHierarchy?: AccessControlProviderProps["roleHierarchy"];
}): Snapshot {
  if (isDev()) {
    if (input.permissions !== undefined && !Array.isArray(input.permissions)) {
      console.warn(WARNINGS.NON_ARRAY_PERMISSIONS);
    }
    if (input.roles !== undefined && !Array.isArray(input.roles)) {
      console.warn(WARNINGS.NON_ARRAY_ROLES);
    }
  }

  const normalizedPermissions = normalizePermissions(
    Array.isArray(input.permissions) ? input.permissions : [],
  );
  const normalizedRoles = normalizeRoles(
    Array.isArray(input.roles) ? input.roles : [],
  );
  const expandedRoles = expandRoles(normalizedRoles, input.roleHierarchy);
  const features = normalizeFeatures(input.features);
  const attributes = input.attributes ?? {};

  return {
    permissions: normalizedPermissions,
    roles: expandedRoles,
    features,
    attributes,
  };
}

function mergeLoadResult(
  current: Snapshot,
  loaded: AccessLoadResult,
  roleHierarchy: AccessControlProviderProps["roleHierarchy"],
): Snapshot {
  return buildSnapshot({
    permissions:
      loaded.permissions !== undefined
        ? loaded.permissions
        : current.permissions,
    roles: loaded.roles !== undefined ? loaded.roles : current.roles,
    features:
      loaded.features !== undefined ? loaded.features : current.features,
    attributes:
      loaded.attributes !== undefined ? loaded.attributes : current.attributes,
    roleHierarchy,
  });
}

export function AccessControlProvider({
  permissions,
  roles,
  features,
  attributes,
  policies,
  roleHierarchy,
  loadAccess,
  children,
}: AccessControlProviderProps): ReactElement {
  const syncSnapshot = useMemo(
    () =>
      buildSnapshot({
        permissions,
        roles,
        features,
        attributes,
        roleHierarchy,
      }),
    [permissions, roles, features, attributes, roleHierarchy],
  );

  const syncSnapshotRef = useRef(syncSnapshot);
  syncSnapshotRef.current = syncSnapshot;

  const [asyncSnapshot, setAsyncSnapshot] = useState<Snapshot | null>(null);
  const [status, setStatus] = useState<AccessStatus>(() =>
    loadAccess ? "loading" : "ready",
  );
  const [error, setError] = useState<Error | null>(null);
  const requestId = useRef(0);
  const loadAccessRef = useRef(loadAccess);
  loadAccessRef.current = loadAccess;

  const policyMap = policies ?? EMPTY_POLICIES;

  const reload = useCallback(async () => {
    const loader = loadAccessRef.current;
    if (!loader) {
      setStatus("ready");
      setError(null);
      setAsyncSnapshot(null);
      return;
    }

    const id = ++requestId.current;
    setStatus("loading");
    setError(null);

    try {
      const result = await loader();
      if (id !== requestId.current) {
        return;
      }
      setAsyncSnapshot((prev) =>
        mergeLoadResult(
          prev ?? syncSnapshotRef.current,
          result ?? {},
          roleHierarchy,
        ),
      );
      setStatus("ready");
    } catch (err) {
      if (id !== requestId.current) {
        return;
      }
      const next =
        err instanceof Error
          ? err
          : new Error("react-access-control-kit: loadAccess failed.");
      setError(next);
      setStatus("error");
    }
  }, [roleHierarchy]);

  useEffect(() => {
    if (!loadAccess) {
      setAsyncSnapshot(null);
      setStatus("ready");
      setError(null);
      return;
    }

    void reload();
    return () => {
      requestId.current += 1;
    };
  }, [loadAccess, reload]);

  const active = asyncSnapshot ?? syncSnapshot;

  const value = useMemo(
    () => ({
      permissions: active.permissions,
      roles: active.roles,
      features: active.features,
      attributes: active.attributes,
      permissionSet: new Set(active.permissions),
      roleSet: new Set(active.roles),
      featureSet: new Set(active.features),
      roleHierarchy,
      policies: policyMap,
      status,
      error,
      reload,
    }),
    [active, roleHierarchy, policyMap, status, error, reload],
  );

  return (
    <AccessControlContext.Provider value={value}>
      {children}
    </AccessControlContext.Provider>
  );
}
