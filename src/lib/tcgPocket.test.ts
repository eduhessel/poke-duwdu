import { describe, expect, it } from "vitest";
import {
  isTcgPocketAssetUrl,
  isTcgPocketCardId,
  isTcgPocketSetId,
} from "./tcgPocket";

describe("tcgPocket", () => {
  it("detects Pocket asset URLs", () => {
    expect(
      isTcgPocketAssetUrl("https://assets.tcgdex.net/pt-br/tcgp/A2b/108/high.webp"),
    ).toBe(true);
    expect(isTcgPocketAssetUrl("https://assets.tcgdex.net/pt-br/sv/sv03/125/high.webp")).toBe(
      false,
    );
  });

  it("detects Pocket set IDs", () => {
    expect(isTcgPocketSetId("A2b")).toBe(true);
    expect(isTcgPocketSetId("A1")).toBe(true);
    expect(isTcgPocketSetId("B1")).toBe(true);
    expect(isTcgPocketSetId("sv03")).toBe(false);
    expect(isTcgPocketSetId("base1")).toBe(false);
  });

  it("detects Pocket card IDs", () => {
    expect(isTcgPocketCardId("A2b-108")).toBe(true);
    expect(isTcgPocketCardId("sv03-125")).toBe(false);
    expect(isTcgPocketCardId("base1-4")).toBe(false);
  });
});
