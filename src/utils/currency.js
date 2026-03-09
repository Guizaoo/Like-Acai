export function parseCurrencyToCents(value) {
  // Suporte direto para número (ex.: 12.5 => 1250).
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value * 100);
  }

  if (!value) return 0;

  // Limpa símbolos e converte padrões pt-BR para número JS.
  const numeric = String(value).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const parsed = Number.parseFloat(numeric);

  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export function formatCents(cents) {
  // Formatação padrão em BRL para toda UI.
  const normalized = Number.isFinite(cents) ? cents : 0;
  return (normalized / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
