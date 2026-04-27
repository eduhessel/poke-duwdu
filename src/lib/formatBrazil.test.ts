import { describe, expect, it } from "vitest";
import { formatBrazilDate, formatBrazilTime } from "./formatBrazil";

describe("formatBrazilDate", () => {
  it("formats YYYY-MM-DD as dd/mm/aaaa", () => {
    expect(formatBrazilDate("2026-04-06")).toBe("06/04/2026");
  });

  it("uses date part of ISO datetime", () => {
    expect(formatBrazilDate("2026-03-06T14:10:14Z")).toBe("06/03/2026");
  });
});

describe("formatBrazilTime", () => {
  it("returns hh:mm for ISO datetime", () => {
    const t = formatBrazilTime("2026-03-06T14:10:14.000Z");
    expect(t).toMatch(/^\d{1,2}:\d{2}$/);
  });
});
