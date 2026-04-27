/** Rótulos de tipo do Pokémon TCG em português (quando a API retorna nomes em inglês). */
const TCG_TYPE_EN_TO_PT: Record<string, string> = {
  Grass: "Grama",
  Fire: "Fogo",
  Water: "Água",
  Lightning: "Elétrico",
  Psychic: "Psíquico",
  Fighting: "Lutador",
  Darkness: "Trevas",
  Metal: "Metal",
  Dragon: "Dragão",
  Fairy: "Fada",
  Colorless: "Incolor",
};

export function formatPokemonTcgTypesForPtBr(types: string[]): string {
  return types.map((t) => TCG_TYPE_EN_TO_PT[t] ?? t).join(", ");
}
