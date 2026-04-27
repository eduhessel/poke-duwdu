const BRL_LOCALE = "pt-BR";
const BRL_CURRENCY = "BRL";

export function formatBrl(value: number): string {
  return new Intl.NumberFormat(BRL_LOCALE, {
    style: "currency",
    currency: BRL_CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);
}

