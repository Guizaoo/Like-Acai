export function parseCurrencyToCents(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value * 100);
  }

  if (!value) return 0;

  const numeric = String(value).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const parsed = Number.parseFloat(numeric);

  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export function formatCents(cents) {
  const normalized = Number.isFinite(cents) ? cents : 0;
  return (normalized / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
