import { createContext } from "react";
import type { AccessControlContextValue } from "../types";

export const AccessControlContext =
  createContext<AccessControlContextValue | null>(null);
