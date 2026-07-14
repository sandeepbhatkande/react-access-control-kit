import { useContext } from "react";
import { AccessControlContext } from "../provider/AccessControlContext";
import { ERRORS } from "../constants";
import type { AccessControlContextValue } from "../types";

export function useAccessControlContext(): AccessControlContextValue {
  const context = useContext(AccessControlContext);

  if (context === null) {
    throw new Error(ERRORS.MISSING_PROVIDER);
  }

  return context;
}
