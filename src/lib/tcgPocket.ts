import type { Product } from "@/data/products";

/** Arte oficial da TCGdex para Pocket fica sob `.../tcgp/...`. */
export function isTcgPocketAssetUrl(url: string | undefined): boolean {
  return Boolean(url?.includes("/tcgp/"));
}

/**
 * Expansões do Pokémon TCG Pocket na TCGdex usam IDs curtos (ex.: A1, A2b, B1).
 * IDs do Pokémon TCG principal costumam começar com prefixos tipo `sv`, `swsh`, `base`.
 */
export function isTcgPocketSetId(setId: string): boolean {
  return /^[A-H]\d+[a-z]?$/i.test(setId);
}

export function isTcgPocketCardId(cardId: string): boolean {
  const idx = cardId.lastIndexOf("-");
  if (idx <= 0) return false;
  const setId = cardId.slice(0, idx);
  return isTcgPocketSetId(setId);
}

export function isTcgPocketProduct(product: Product): boolean {
  if (isTcgPocketAssetUrl(product.officialReferenceImageUrl)) return true;
  for (const url of product.customImages) {
    if (isTcgPocketAssetUrl(url)) return true;
  }
  return isTcgPocketCardId(product.pokemonTcgId);
}
