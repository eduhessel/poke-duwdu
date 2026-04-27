import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { OfficialCardImage } from "@/components/official-card-image";
import { getProductById } from "@/data/products";
import { formatBrazilDate } from "@/lib/formatBrazil";
import { formatBrl } from "@/lib/money";
import { formatPokemonTcgTypesForPtBr } from "@/lib/pokemonTcgTypesPt";
import {
  fetchTcgDexCardById,
  fetchTcgDexSetById,
  getPokemonTcgIoImageUrlFromId,
  getTcgDexImageUrl,
} from "@/lib/tcgDex";
import { isTcgPocketProduct } from "@/lib/tcgPocket";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  if (isTcgPocketProduct(product)) notFound();

  const card = await fetchTcgDexCardById(product.pokemonTcgId);
  const setDetails =
    card?.set?.id != null ? await fetchTcgDexSetById(card.set.id) : null;

  const manualRef = product.officialReferenceImageUrl?.trim() || null;
  const tcgdexImage = card?.image ? getTcgDexImageUrl(card.image, "high") : null;
  const pokemonTcgFallback = getPokemonTcgIoImageUrlFromId(
    product.pokemonTcgId,
    "high"
  );
  const primaryRefImage = manualRef ?? tcgdexImage;
  const fallbackRefImage = manualRef
    ? (tcgdexImage ?? pokemonTcgFallback)
    : pokemonTcgFallback;

  const hasOfficialPanel = Boolean(card ?? manualRef);

  return (
    <Container className="py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-3xl bg-card p-6 ring-1 ring-border sm:p-7">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              Produto • fotos reais
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 inline-flex rounded-full bg-background/40 px-3 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-border">
              {product.condition}
            </p>
            <div className="mt-3 text-xs text-muted-foreground">
              {product.listedAt ? (
                <p>
                  Anunciado em{" "}
                  <span className="font-semibold text-foreground">
                    {formatBrazilDate(product.listedAt)}
                  </span>
                </p>
              ) : null}
            </div>
            <p className="mt-5 text-2xl font-semibold text-foreground">
              {formatBrl(product.price)}
            </p>
            <div className="mt-5">
              <AddToCartButton product={product} />
            </div>
          </div>

          <ProductGallery images={product.customImages} name={product.name} />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-card p-6 ring-1 ring-border">
            <h2 className="text-sm font-semibold text-foreground">
              Referência oficial (Pokémon TCG)
            </h2>

            {hasOfficialPanel ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr]">
                <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
                  <OfficialCardImage
                    primarySrc={primaryRefImage}
                    fallbackSrc={fallbackRefImage}
                    alt={card?.name ?? product.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">
                    {card?.name ?? product.name}
                  </p>
                  {card ? (
                    <>
                      <dl className="mt-2 space-y-1 text-muted-foreground">
                        {card.illustrator ? (
                          <div className="flex gap-2">
                            <dt className="w-20 shrink-0">Arte</dt>
                            <dd className="text-foreground">{card.illustrator}</dd>
                          </div>
                        ) : null}
                        {card.set?.name ? (
                          <div className="flex gap-2">
                            <dt className="w-20 shrink-0">Set</dt>
                            <dd className="text-foreground">{card.set.name}</dd>
                          </div>
                        ) : null}
                        {setDetails?.releaseDate ? (
                          <div className="flex gap-2">
                            <dt className="w-20 shrink-0">Lançamento</dt>
                            <dd className="text-foreground">
                              {formatBrazilDate(setDetails.releaseDate)}
                            </dd>
                          </div>
                        ) : null}
                        {card.localId !== undefined ? (
                          <div className="flex gap-2">
                            <dt className="w-20 shrink-0">Número</dt>
                            <dd className="text-foreground">{String(card.localId)}</dd>
                          </div>
                        ) : null}
                        {card.rarity ? (
                          <div className="flex gap-2">
                            <dt className="w-20 shrink-0">Raridade</dt>
                            <dd className="text-foreground">{card.rarity}</dd>
                          </div>
                        ) : null}
                        {card.types?.length ? (
                          <div className="flex gap-2">
                            <dt className="w-20 shrink-0">Tipo</dt>
                            <dd className="text-foreground">
                              {formatPokemonTcgTypesForPtBr(card.types)}
                            </dd>
                          </div>
                        ) : null}
                        {card.regulationMark ? (
                          <div className="flex gap-2">
                            <dt className="w-20 shrink-0">Regulamento</dt>
                            <dd className="text-foreground">{card.regulationMark}</dd>
                          </div>
                        ) : null}
                        <div className="flex gap-2">
                          <dt className="w-20 shrink-0">ID</dt>
                          <dd className="text-foreground">{card.id}</dd>
                        </div>
                      </dl>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Nomes de expansão em português (pt-BR) conforme a base TCGdex
                        (idioma da API).
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-foreground">
                      Imagem de referência manual. Dados da TCGdex não carregaram para
                      este ID — confira o{" "}
                      <span className="font-semibold">{product.pokemonTcgId}</span>
                      .
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Não foi possível carregar a referência oficial agora. Você ainda
                pode comprar normalmente usando as fotos reais do produto.
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

