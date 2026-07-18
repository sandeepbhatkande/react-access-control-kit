import { describe, expect, it } from "vitest";
import {
  hasAllFeatures,
  hasAnyFeature,
  hasFeature,
} from "../../src/core/features";
import { normalizeFeatures } from "../../src/utils/normalizeFeatures";

describe("normalizeFeatures", () => {
  it("normalizes arrays", () => {
    expect(normalizeFeatures([" beta ", "beta", "dark"])).toEqual([
      "beta",
      "dark",
    ]);
  });

  it("skips invalid array entries", () => {
    expect(normalizeFeatures(["ok", 1 as unknown as string, "  "])).toEqual([
      "ok",
    ]);
  });

  it("normalizes maps", () => {
    expect(normalizeFeatures({ beta: true, dark: false, neon: true })).toEqual([
      "beta",
      "neon",
    ]);
  });

  it("returns empty for nullish and non-objects", () => {
    expect(normalizeFeatures(null)).toEqual([]);
    expect(normalizeFeatures(undefined)).toEqual([]);
    expect(normalizeFeatures("x" as unknown as string[])).toEqual([]);
  });
});

describe("feature helpers", () => {
  it("checks membership", () => {
    expect(hasFeature(["beta", "dark"], "beta")).toBe(true);
    expect(hasFeature(["beta"], "dark")).toBe(false);
    expect(hasAnyFeature(["beta"], ["dark", "beta"])).toBe(true);
    expect(hasAllFeatures(["beta", "dark"], ["beta", "dark"])).toBe(true);
    expect(hasAllFeatures(["beta"], ["beta", "dark"])).toBe(false);
    expect(hasAnyFeature(["beta"], [])).toBe(false);
    expect(hasAllFeatures(["beta"], [])).toBe(false);
  });

  it("validates inputs", () => {
    expect(() => hasFeature(["beta"], "")).toThrow(/non-empty feature/);
    expect(() => hasAnyFeature(["beta"], "x" as unknown as string[])).toThrow(
      /array of features/,
    );
    expect(() => hasAllFeatures(["beta"], "x" as unknown as string[])).toThrow(
      /array of features/,
    );
  });
});
