const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})/;

/**
 * Formata `YYYY-MM-DD` ou início de ISO-8601 como **dd/mm/aaaa** (sem depender de fuso para a parte da data).
 */
export function formatBrazilDate(isoDate: string): string {
  const trimmed = isoDate.trim();
  const m = DATE_ONLY_RE.exec(trimmed);
  if (!m) return trimmed;
  const [, y, mo, d] = m;
  return `${d}/${mo}/${y}`;
}

/**
 * Extrai **hh:mm** (24h) de uma string ISO-8601 com horário.
 */
export function formatBrazilTime(isoDateTime: string): string {
  const d = new Date(isoDateTime);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}
