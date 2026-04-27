import rawProducts from "./products.json";

export type ProductCondition =
  | "Near Mint"
  | "Lightly Played"
  | "Moderately Played"
  | "Heavily Played"
  | "Damaged";

export type Product = {
  id: string;
  name: string;
  price: number;
  condition: ProductCondition | string;
  pokemonTcgId: string;
  customImages: string[];
  /** URL da arte oficial (substitui TCGdex/pokemontcg quando a API não entrega imagem). */
  officialReferenceImageUrl?: string;
  listedAt?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function parseProduct(input: unknown): Product | null {
  if (!isRecord(input)) return null;

  const {
    id,
    name,
    price,
    condition,
    pokemonTcgId,
    customImages,
    officialReferenceImageUrl,
    listedAt,
  } = input;

  if (typeof id !== "string" || id.length === 0) return null;
  if (typeof name !== "string" || name.length === 0) return null;
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0)
    return null;
  if (typeof condition !== "string" || condition.length === 0) return null;
  if (typeof pokemonTcgId !== "string" || pokemonTcgId.length === 0) return null;
  if (!isStringArray(customImages)) return null;

  if (listedAt !== undefined && typeof listedAt !== "string") return null;
  if (
    officialReferenceImageUrl !== undefined &&
    typeof officialReferenceImageUrl !== "string"
  )
    return null;

  return {
    id,
    name,
    price,
    condition,
    pokemonTcgId,
    customImages,
    ...(typeof officialReferenceImageUrl === "string" &&
    officialReferenceImageUrl.length > 0
      ? { officialReferenceImageUrl }
      : {}),
    listedAt,
  };
}

export function getProducts(): Product[] {
  const parsed = Array.isArray(rawProducts)
    ? rawProducts.map(parseProduct).filter((p): p is Product => p !== null)
    : [];

  return parsed;
}

export function getProductById(productId: string): Product | null {
  return getProducts().find((p) => p.id === productId) ?? null;
}

