export function buildWhatsAppCheckoutMessage(options: {
  lines: string[];
  totalBrl: string;
}): string {
  const header = "Olá! Tenho interesse nas seguintes cartas:";
  const items = options.lines.map((l) => `- ${l}`).join("\n");
  const total = `\n\nTotal: ${options.totalBrl}`;
  return `${header}\n${items}${total}`;
}

export function buildWhatsAppUrl(options: {
  message: string;
  phoneE164?: string | null;
}): string {
  const encoded = encodeURIComponent(options.message);
  const phone = options.phoneE164?.replace(/[^\d]/g, "") ?? "";
  if (phone) return `https://wa.me/${phone}?text=${encoded}`;
  return `https://wa.me/?text=${encoded}`;
}

