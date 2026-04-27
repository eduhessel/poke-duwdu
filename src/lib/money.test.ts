import { describe, expect, it } from "vitest";
import { formatBrl } from "./money";

describe("formatBrl", () => {
  it("formats integer values in BRL", () => {
    expect(formatBrl(1200)).toBe("R$\u00a01.200");
  });
});

