import { useMemo } from "react";
import type { FeatureFlag } from "../types";
import {
  featureSetHas,
  featureSetHasAll,
  featureSetHasAny,
} from "../core/features";
import { useAccessControlContext } from "./useAccessControlContext";

export function useFeature(feature: FeatureFlag): boolean {
  const { featureSet } = useAccessControlContext();
  return useMemo(
    () => featureSetHas(featureSet, feature),
    [featureSet, feature],
  );
}

export function useAnyFeature(features: readonly FeatureFlag[]): boolean {
  const { featureSet } = useAccessControlContext();
  return useMemo(
    () => featureSetHasAny(featureSet, features),
    [featureSet, features],
  );
}

export function useAllFeatures(features: readonly FeatureFlag[]): boolean {
  const { featureSet } = useAccessControlContext();
  return useMemo(
    () => featureSetHasAll(featureSet, features),
    [featureSet, features],
  );
}
