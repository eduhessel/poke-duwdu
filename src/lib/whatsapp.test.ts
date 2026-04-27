import { describe, expect, it } from "vitest";
import { buildWhatsAppCheckoutMessage, buildWhatsAppUrl } from "./whatsapp";

describe("whatsapp helpers", () => {
  it("builds a checkout message", () => {
    const msg = buildWhatsAppCheckoutMessage({
      lines: ["Charizard Base Set - R$1200"],
      totalBrl: "R$1200",
    });

    expect(msg).toContain("Olá! Tenho interesse nas seguintes cartas:");
    expect(msg).toContain("- Charizard Base Set - R$1200");
    expect(msg).toContain("Total: R$1200");
  });

  it("builds a wa.me url with phone", () => {
    const url = buildWhatsAppUrl({ message: "oi", phoneE164: "5511999999999" });
    expect(url).toBe("https://wa.me/5511999999999?text=oi");
  });

  it("builds a wa.me url without phone", () => {
    const url = buildWhatsAppUrl({ message: "oi" });
    expect(url).toBe("https://wa.me/?text=oi");
  });
});

