import { NextResponse } from "next/server";
import { getPokemonTcgIoImageUrlFromId, getTcgDexImageUrl } from "@/lib/tcgDex";
import { isTcgPocketAssetUrl, isTcgPocketCardId } from "@/lib/tcgPocket";

type TcgDexCardBrief = {
  id: string;
  localId?: string | number;
  name: string;
  image?: string;
};

function isPocketBrief(b: TcgDexCardBrief): boolean {
  if (isTcgPocketAssetUrl(b.image)) return true;
  return isTcgPocketCardId(b.id);
}

const TCGDEX_API_BASE_URL = "https://api.tcgdex.net/v2";
const DEFAULT_LANGUAGE = "pt-br";
const FALLBACK_LANGUAGE = "en";
const REVALIDATE_SECONDS = 60 * 30; // 30min

function parseSetIdFromCardId(cardId: string): string | null {
  const idx = cardId.lastIndexOf("-");
  if (idx <= 0) return null;
  return cardId.slice(0, idx);
}

async function fetchCardBriefsByQuery(lang: string, query: string) {
  const url = `${TCGDEX_API_BASE_URL}/${encodeURIComponent(
    lang
  )}/cards?name=${encodeURIComponent(query)}`;

  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) return [] as TcgDexCardBrief[];
  const json = (await res.json()) as unknown;
  if (!Array.isArray(json)) return [] as TcgDexCardBrief[];
  return json as TcgDexCardBrief[];
}

/**
 * Em pt-br, buscas comuns (ex.: "Charizard") retornam só cartas Pocket; em `en` vêm
 * também as do Pokémon TCG principal. Unimos e preferimos pt-br para nome quando existir.
 */
function mergeBriefsPreferPt(
  ptBr: TcgDexCardBrief[],
  en: TcgDexCardBrief[]
): TcgDexCardBrief[] {
  const byId = new Map<string, TcgDexCardBrief>();
  for (const b of en) {
    byId.set(b.id, b);
  }
  for (const b of ptBr) {
    byId.set(b.id, b);
  }
  return [...byId.values()];
}

// Nota: buscar nome do set para cada resultado deixa a busca lenta/instável.
// Aqui devolvemos só o `set.id` (e `set.name` como null); o nome completo já aparece
// depois na validação do card completo.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [ptBr, en] = await Promise.all([
    fetchCardBriefsByQuery(DEFAULT_LANGUAGE, name),
    fetchCardBriefsByQuery(FALLBACK_LANGUAGE, name),
  ]);
  const briefs = mergeBriefsPreferPt(ptBr, en);

  const tokens = name
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  const filtered = tokens.length
    ? briefs.filter((b) => {
        const n = b.name.toLowerCase();
        return tokens.every((t) => n.includes(t));
      })
    : briefs;

  const nonPocket = filtered.filter((b) => !isPocketBrief(b));

  const results = nonPocket.slice(0, 30).map((b) => {
    const setId = parseSetIdFromCardId(b.id);

    const tcgdexThumb = b.image ? getTcgDexImageUrl(b.image, "thumb") : null;
    const pokemonTcgThumb = getPokemonTcgIoImageUrlFromId(b.id, "thumb");

    return {
      id: b.id,
      name: b.name,
      primaryImage: tcgdexThumb,
      fallbackImage: pokemonTcgThumb,
      localId: b.localId ?? null,
      set: setId ? { id: setId, name: null } : null,
    };
  });

  return NextResponse.json({ results });
}

