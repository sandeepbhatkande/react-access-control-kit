import type { FeatureFlag } from "../types";

export function featureSetHas(
  featureSet: ReadonlySet<FeatureFlag>,
  feature: FeatureFlag,
): boolean {
  if (typeof feature !== "string" || feature.length === 0) {
    throw new TypeError(
      "react-access-control-kit: expected a non-empty feature string.",
    );
  }
  return featureSet.has(feature);
}

export function featureSetHasAny(
  featureSet: ReadonlySet<FeatureFlag>,
  features: readonly FeatureFlag[],
): boolean {
  if (!Array.isArray(features)) {
    throw new TypeError(
      "react-access-control-kit: expected an array of features.",
    );
  }
  if (features.length === 0) {
    return false;
  }
  return features.some((feature) => featureSetHas(featureSet, feature));
}

export function featureSetHasAll(
  featureSet: ReadonlySet<FeatureFlag>,
  features: readonly FeatureFlag[],
): boolean {
  if (!Array.isArray(features)) {
    throw new TypeError(
      "react-access-control-kit: expected an array of features.",
    );
  }
  if (features.length === 0) {
    return false;
  }
  return features.every((feature) => featureSetHas(featureSet, feature));
}

export function hasFeature(
  features: readonly FeatureFlag[],
  feature: FeatureFlag,
): boolean {
  return featureSetHas(new Set(features), feature);
}

export function hasAnyFeature(
  features: readonly FeatureFlag[],
  required: readonly FeatureFlag[],
): boolean {
  return featureSetHasAny(new Set(features), required);
}

export function hasAllFeatures(
  features: readonly FeatureFlag[],
  required: readonly FeatureFlag[],
): boolean {
  return featureSetHasAll(new Set(features), required);
}
