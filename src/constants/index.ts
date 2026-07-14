export const ERRORS = {
  MISSING_PROVIDER:
    "react-access-control-kit: hooks and components must be used within <AccessControlProvider>.",
  INVALID_ACCESS_STATE:
    "react-access-control-kit: AccessState must provide permissions and roles as arrays.",
} as const;

export const WARNINGS = {
  NON_ARRAY_PERMISSIONS:
    "react-access-control-kit: `permissions` prop should be an array. Falling back to [].",
  NON_ARRAY_ROLES:
    "react-access-control-kit: `roles` prop should be an array. Falling back to [].",
  NON_STRING_PERMISSION:
    "react-access-control-kit: skipped non-string permission value:",
  NON_STRING_ROLE: "react-access-control-kit: skipped non-string role value:",
  EMPTY_PERMISSION:
    "react-access-control-kit: skipped empty permission string.",
  EMPTY_ROLE: "react-access-control-kit: skipped empty role string.",
} as const;

export const DEFAULT_MODE = "any" as const;
