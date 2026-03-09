// Tamanhos menores têm menos complementos grátis.
// Regra comercial definida para controlar custo nos copos pequenos.
const SMALL_ACAI_SIZES_WITH_3_FREE = new Set([150, 200, 300]);

// Valor cobrado por complemento excedente.
export const EXTRA_COMPLEMENT_CENTS = 200;

export function getFreeComplementLimit(sizeMl) {
  // 150/200/300ml => 3 grátis; demais => 4 grátis.
  return SMALL_ACAI_SIZES_WITH_3_FREE.has(sizeMl) ? 3 : 4;
}

export function getChargedComplementCount(selectedCount, freeLimit) {
  // Quantos itens passam do limite grátis.
  return Math.max(0, selectedCount - freeLimit);
}

export function calculateExtraComplementCents(selectedCount, freeLimit) {
  // Acréscimo final em centavos.
  return getChargedComplementCount(selectedCount, freeLimit) * EXTRA_COMPLEMENT_CENTS;
}
