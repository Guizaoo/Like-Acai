const SMALL_ACAI_SIZES_WITH_3_FREE = new Set([150, 200, 300]);

export const EXTRA_COMPLEMENT_CENTS = 200;

export function getFreeComplementLimit(sizeMl) {
  return SMALL_ACAI_SIZES_WITH_3_FREE.has(sizeMl) ? 3 : 4;
}

export function getChargedComplementCount(selectedCount, freeLimit) {
  return Math.max(0, selectedCount - freeLimit);
}

export function calculateExtraComplementCents(selectedCount, freeLimit) {
  return getChargedComplementCount(selectedCount, freeLimit) * EXTRA_COMPLEMENT_CENTS;
}
