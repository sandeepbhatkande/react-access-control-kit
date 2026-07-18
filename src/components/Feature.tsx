import type { ReactNode } from "react";
import type { FeatureProps } from "../types";
import { DEFAULT_MODE } from "../constants";
import { useAllFeatures, useAnyFeature } from "../hooks/useFeature";

function resolveFeatures(props: FeatureProps): readonly string[] {
  if (props.features !== undefined) {
    return props.features;
  }
  if (props.feature !== undefined) {
    return [props.feature];
  }
  return [];
}

export function Feature({
  feature,
  features,
  mode = DEFAULT_MODE,
  fallback = null,
  children = null,
}: FeatureProps): ReactNode {
  const list = resolveFeatures({ feature, features });
  const hasAny = useAnyFeature(list);
  const hasAll = useAllFeatures(list);
  const allowed = mode === "all" ? hasAll : hasAny;

  return allowed ? children : fallback;
}
