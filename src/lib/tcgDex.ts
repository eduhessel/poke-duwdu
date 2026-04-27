export type TcgDexCard = {
  id: string;
  name: string;
  image?: string;
  illustrator?: string;
  localId?: string | number;
  updated?: string;
  rarity?: string;
  types?: string[];
  regulationMark?: string;
  set?: { id: string; name: string };
};

export type TcgDexSetDetails = {
  id: string;
  name: string;
  releaseDate?: string;
};

export function getTcgDexImageUrl(
  baseImageUrl: string,
  variant: "thumb" | "high"
): string {
  // A TCGdex normalmente retorna um "base url" (sem extensão).
  // Para usar como imagem, adicionamos "{quality}.{extension}".
  //
  // Formato documentado: https://tcgdex.dev/assets (ex.: .../136/high.webp)
  if (baseImageUrl.endsWith(".png") || baseImageUrl.endsWith(".webp")) {
    return baseImageUrl;
  }

  return `${baseImageUrl}/${variant === "thumb" ? "low.webp" : "high.webp"}`;
}

export function getPokemonTcgIoImageUrlFromId(
  cardId: string,
  variant: "thumb" | "high"
): string | null {
  // Para IDs no formato "{setId}-{localId}" (ex.: "base1-4").
  const idx = cardId.lastIndexOf("-");
  if (idx <= 0) return null;

  const setId = cardId.slice(0, idx);
  const localId = cardId.slice(idx + 1);
  if (!setId || !localId) return null;

  // O pokemontcg.io usa IDs de set em lowercase (ex.: base1, swsh3, sv03.5).
  // IDs como "A1", "A2b" (TCG Pocket) não são compatíveis e acabam retornando imagem genérica.
  if (!/^[a-z0-9.]+$/.test(setId)) return null;
  if (
    !/^(base|gym|neo|ex|dp|pl|hgss|bw|xy|sm|swsh|sv|det|ecard|lc|pop|sma|smp|swshp|xyp|dpp)/.test(
      setId
    )
  ) {
    return null;
  }

  // Pokémon TCG (pokemontcg.io) usa:
  // - thumb: https://images.pokemontcg.io/{setId}/{localId}.png
  // - high:  https://images.pokemontcg.io/{setId}/{localId}_hires.png
  const base = `https://images.pokemontcg.io/${encodeURIComponent(
    setId
  )}/${encodeURIComponent(localId)}`;

  return variant === "thumb" ? `${base}.png` : `${base}_hires.png`;
}

type TcgDexApiError = {
  error: string;
};

const TCGDEX_API_BASE_URL = "https://api.tcgdex.net/v2";
const DEFAULT_LANGUAGE = "pt-br";
const FALLBACK_LANGUAGE = "en";
const DEFAULT_REVALIDATE_SECONDS = 60 * 60 * 24; // 24h

function isApiError(value: unknown): value is TcgDexApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as { error?: unknown }).error === "string"
  );
}

export async function fetchTcgDexSetById(
  setId: string,
  options?: { language?: string; revalidateSeconds?: number }
): Promise<TcgDexSetDetails | null> {
  const language = options?.language ?? DEFAULT_LANGUAGE;

  try {
    const fetchOne = async (lang: string): Promise<TcgDexSetDetails | null> => {
      const url = `${TCGDEX_API_BASE_URL}/${encodeURIComponent(
        lang
      )}/sets/${encodeURIComponent(setId)}`;

      const res = await fetch(url, {
        next: { revalidate: options?.revalidateSeconds ?? DEFAULT_REVALIDATE_SECONDS },
      });

      if (!res.ok) return null;
      const json: unknown = await res.json();
      if (isApiError(json)) return null;

      const set = json as {
        id?: string;
        name?: string;
        releaseDate?: string;
      };
      if (!set?.id || !set?.name) return null;
      return {
        id: set.id,
        name: set.name,
        releaseDate: typeof set.releaseDate === "string" ? set.releaseDate : undefined,
      };
    };

    return (await fetchOne(language)) ?? (await fetchOne(FALLBACK_LANGUAGE));
  } catch {
    return null;
  }
}

export async function fetchTcgDexCardById(
  cardId: string,
  options?: { language?: string; revalidateSeconds?: number }
): Promise<TcgDexCard | null> {
  const language = options?.language ?? DEFAULT_LANGUAGE;

  try {
    const fetchOne = async (lang: string): Promise<TcgDexCard | null> => {
      const url = `${TCGDEX_API_BASE_URL}/${encodeURIComponent(
        lang
      )}/cards/${encodeURIComponent(cardId)}`;

      const res = await fetch(url, {
        next: { revalidate: options?.revalidateSeconds ?? DEFAULT_REVALIDATE_SECONDS },
      });

      if (!res.ok) return null;
      const json: unknown = await res.json();
      if (isApiError(json)) return null;

      const card = json as TcgDexCard;
      if (!card?.id || !card?.name) return null;
      return card;
    };

    return (await fetchOne(language)) ?? (await fetchOne(FALLBACK_LANGUAGE));
  } catch {
    return null;
  }
}

