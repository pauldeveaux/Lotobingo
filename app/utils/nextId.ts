/**
 * Computes the next available ID, filling gaps in existing numeric IDs.
 * Used by stores that manage entities in an id-keyed record.
 */
export function nextId(record: Record<string | number, unknown>): number {
  const ids = Object.keys(record).map(Number).sort((a, b) => a - b)
  if (ids.length === 0) return 1
  for (let i = 0; i < ids.length; i++) {
    if (ids[i] !== i + 1) return i + 1
  }
  return ids.length + 1
}
