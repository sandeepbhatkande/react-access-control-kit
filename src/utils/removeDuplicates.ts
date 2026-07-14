/**
 * Return a new array with duplicates removed, preserving first-seen order.
 */
export function removeDuplicates<T>(values: readonly T[]): T[] {
  const seen = new Set<T>();
  const result: T[] = [];

  for (const value of values) {
    if (seen.has(value)) {
      continue;
    }
    seen.add(value);
    result.push(value);
  }

  return result;
}
