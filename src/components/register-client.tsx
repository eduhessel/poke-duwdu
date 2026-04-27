"use client";

import { useMemo, useState } from "react";
import { ADMIN_PASSWORD } from "@/config/store";
import { getProducts } from "@/data/products";
import { fetchTcgDexCardById, getTcgDexImageUrl } from "@/lib/tcgDex";
import { isTcgPocketAssetUrl, isTcgPocketCardId } from "@/lib/tcgPocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TcgSearchResultsDialog,
  type TcgSearchResultRow,
} from "@/components/tcg-search-results-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DraftProduct = {
  id: string;
  name: string;
  price: number;
  condition: string;
  pokemonTcgId: string;
  customImages: string; // comma separated
  /** URL direta da arte oficial (recomendado quando a imagem não carrega via API). */
  officialReferenceImageUrl: string;
  listedAt: string; // yyyy-mm-dd
};

const CONDITION_OPTIONS = [
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
] as const;

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function RegisterClient() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const [tcgdexId, setTcgdexId] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [nameStatus, setNameStatus] = useState<"idle" | "loading" | "done">(
    "idle"
  );
  const [nameResults, setNameResults] = useState<TcgSearchResultRow[]>([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [cardStatus, setCardStatus] = useState<
    "idle" | "loading" | "found" | "notFound" | "pocket"
  >("idle");
  const [cardPreview, setCardPreview] = useState<{
    id: string;
    name: string;
    image?: string;
    illustrator?: string;
    setName?: string;
    localId?: string | number;
    rarity?: string;
  } | null>(null);

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [draft, setDraft] = useState<DraftProduct>({
    id: "",
    name: "",
    price: 0,
    condition: "Near Mint",
    pokemonTcgId: "",
    customImages: "",
    officialReferenceImageUrl: "",
    listedAt: todayIso,
  });

  const products = useMemo(() => getProducts(), []);

  const generatedJson = useMemo(() => {
    const customImages = draft.customImages
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const officialRef = draft.officialReferenceImageUrl.trim();

    const product = {
      id: draft.id || slugify(draft.name || "carta"),
      name: draft.name,
      price: draft.price,
      condition: draft.condition,
      pokemonTcgId: draft.pokemonTcgId,
      customImages,
      ...(officialRef ? { officialReferenceImageUrl: officialRef } : {}),
      listedAt: draft.listedAt || undefined,
    };

    return JSON.stringify(product, null, 2);
  }, [draft]);

  async function handleValidateCard(forcedId?: string) {
    const id = (forcedId ?? tcgdexId).trim();
    if (!id) return;

    setCardStatus("loading");
    const card = await fetchTcgDexCardById(id);
    if (!card) {
      setCardPreview(null);
      setCardStatus("notFound");
      return;
    }

    if (isTcgPocketCardId(card.id) || isTcgPocketAssetUrl(card.image)) {
      setCardPreview(null);
      setCardStatus("pocket");
      return;
    }

    setCardPreview({
      id: card.id,
      name: card.name,
      image: card.image,
      illustrator: card.illustrator,
      setName: card.set?.name,
      localId: card.localId,
      rarity: card.rarity,
    });
    setCardStatus("found");

    const suggestedOfficial =
      card.image && !draft.officialReferenceImageUrl.trim()
        ? getTcgDexImageUrl(card.image, "high")
        : "";

    setDraft((d) => ({
      ...d,
      pokemonTcgId: card.id,
      name: d.name || card.name,
      id: d.id || slugify(`${card.name}-${card.id}`),
      officialReferenceImageUrl:
        d.officialReferenceImageUrl.trim() || suggestedOfficial,
    }));
  }

  async function handleSearchByName() {
    const q = nameQuery.trim();
    if (q.length < 2) return;

    setNameStatus("loading");
    setSearchModalOpen(false);
    try {
      const res = await fetch(`/api/tcgdex/search?name=${encodeURIComponent(q)}`);
      const json = (await res.json()) as { results?: unknown };
      const results = Array.isArray(json.results)
        ? (json.results as TcgSearchResultRow[])
        : [];
      setNameResults(results);
      setLastSearchQuery(q);
      if (results.length > 0) {
        setSearchModalOpen(true);
      }
    } finally {
      setNameStatus("done");
    }
  }

  function handlePickSearchResult(cardId: string) {
    setTcgdexId(cardId);
    setCardStatus("idle");
    setCardPreview(null);
    void handleValidateCard(cardId);
  }

  const existingIds = useMemo(() => new Set(products.map((p) => p.id)), [products]);
  const isIdTaken = draft.id ? existingIds.has(draft.id) : false;

  if (!unlocked) {
    return (
      <Card className="mx-auto max-w-xl rounded-3xl">
        <CardHeader>
          <CardTitle>Área de cadastro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Digite a senha para liberar o cadastro.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="h-11 rounded-2xl"
            />
            <Button
              className="h-11 rounded-2xl"
              onClick={() => setUnlocked(password === ADMIN_PASSWORD)}
              type="button"
            >
              Entrar
            </Button>
          </div>
          {password && password !== ADMIN_PASSWORD ? (
            <p className="text-sm text-destructive">Senha incorreta.</p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Obs.: isso é uma trava simples (não substitui autenticação real).
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Cadastrar carta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Buscar por nome (recomendado)
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                placeholder='Nome do Pokémon (ex.: "Charizard")'
                className="h-11 rounded-2xl"
              />
              <Button
                type="button"
                onClick={handleSearchByName}
                className="h-11 rounded-2xl"
                variant="outline"
              >
                Buscar
              </Button>
            </div>
            {nameStatus === "loading" ? (
              <p className="text-sm text-muted-foreground">Buscando…</p>
            ) : null}
            {nameStatus === "done" && lastSearchQuery && nameResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma carta do Pokémon TCG encontrada para “{lastSearchQuery}”.
              </p>
            ) : null}
            {nameResults.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                Última busca: {nameResults.length} carta
                {nameResults.length === 1 ? "" : "s"} —{" "}
                <button
                  type="button"
                  className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
                  onClick={() => setSearchModalOpen(true)}
                >
                  abrir lista
                </button>
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Dica: ao buscar, a lista abre em uma janela para você escolher a carta.
            </p>

            <TcgSearchResultsDialog
              open={searchModalOpen}
              onOpenChange={setSearchModalOpen}
              queryLabel={lastSearchQuery}
              results={nameResults}
              onSelectCard={handlePickSearchResult}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Validar na TCGdex</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={tcgdexId}
                onChange={(e) => setTcgdexId(e.target.value)}
                placeholder='ID da carta (ex.: "base1-4")'
                className="h-11 rounded-2xl"
              />
              <Button
                type="button"
                onClick={() => void handleValidateCard()}
                className="h-11 rounded-2xl"
              >
                Buscar
              </Button>
            </div>
            {cardStatus === "loading" ? (
              <p className="text-sm text-muted-foreground">Buscando…</p>
            ) : null}
            {cardStatus === "notFound" ? (
              <p className="text-sm text-destructive">
                Não achei esse ID na TCGdex (tentamos pt-br e depois en).
              </p>
            ) : null}
            {cardStatus === "pocket" ? (
              <p className="text-sm text-destructive">
                Esta carta é do Pokémon TCG Pocket. A loja trabalha apenas com o Pokémon
                TCG (jogo de cartas principal). Use um ID de expansão do TCG principal.
              </p>
            ) : null}
            {cardPreview ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline">ID: {cardPreview.id}</Badge>
                {cardPreview.setName ? (
                  <Badge variant="outline">Set: {cardPreview.setName}</Badge>
                ) : null}
                {cardPreview.localId !== undefined ? (
                  <Badge variant="outline">Nº: {String(cardPreview.localId)}</Badge>
                ) : null}
                {cardPreview.rarity ? (
                  <Badge variant="outline">Raridade: {cardPreview.rarity}</Badge>
                ) : null}
                {cardPreview.illustrator ? (
                  <Badge variant="outline">Arte: {cardPreview.illustrator}</Badge>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Nome</p>
              <Input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="h-11 rounded-2xl"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">ID interno (slug)</p>
              <Input
                value={draft.id}
                onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))}
                className="h-11 rounded-2xl"
              />
              {isIdTaken ? (
                <p className="text-xs text-destructive">
                  Esse `id` já existe no `products.json`.
                </p>
              ) : null}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Preço</p>
              <Input
                type="number"
                value={draft.price}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, price: Number(e.target.value) }))
                }
                className="h-11 rounded-2xl"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Condição</p>
              <Select
                value={draft.condition}
                onValueChange={(value) =>
                  setDraft((d) => ({ ...d, condition: value ?? d.condition }))
                }
              >
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Selecione…" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">TCGdex card ID</p>
              <Input
                value={draft.pokemonTcgId}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, pokemonTcgId: e.target.value }))
                }
                className="h-11 rounded-2xl"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Anunciado em (YYYY-MM-DD)</p>
              <Input
                value={draft.listedAt}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, listedAt: e.target.value }))
                }
                className="h-11 rounded-2xl"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-sm font-semibold">
                Fotos reais (paths separados por vírgula)
              </p>
              <Input
                value={draft.customImages}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, customImages: e.target.value }))
                }
                placeholder="/images/carta-1.jpg, /images/carta-2.jpg"
                className="h-11 rounded-2xl"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-sm font-semibold">
                Imagem de referência oficial (URL)
              </p>
              <p className="text-xs text-muted-foreground">
                Opcional. Preencha se a arte não aparecer pela TCGdex; ao validar o ID,
                sugerimos o link em alta resolução quando existir.
              </p>
              <Input
                value={draft.officialReferenceImageUrl}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    officialReferenceImageUrl: e.target.value,
                  }))
                }
                placeholder="https://assets.tcgdex.net/pt-br/..."
                className="h-11 rounded-2xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl"
              onClick={async () => {
                await navigator.clipboard.writeText(generatedJson);
              }}
            >
              Copiar JSON do produto
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl"
              onClick={() => {
                setDraft((d) => ({ ...d, id: slugify(d.name) }));
              }}
            >
              Gerar slug pelo nome
            </Button>
          </div>

          <div className="rounded-2xl bg-background/30 p-4 text-sm ring-1 ring-border">
            <p className="font-semibold text-foreground">Cole no `products.json`</p>
            <pre className="mt-2 max-h-72 overflow-auto text-xs text-muted-foreground">
              {generatedJson}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit rounded-3xl">
        <CardHeader>
          <CardTitle>Dica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            A rota <span className="font-semibold text-foreground">/cadastrar</span>{" "}
            gera o objeto do produto para evitar erro de ID.
          </p>
          <p>
            Como a loja é “JSON-first”, o passo final ainda é colar o objeto no{" "}
            <span className="font-semibold text-foreground">`src/data/products.json`</span>{" "}
            (sem backend para escrever arquivo em produção).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

