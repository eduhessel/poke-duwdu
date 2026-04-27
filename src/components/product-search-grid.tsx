"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { Gen1HeroCollage } from "@/components/gen1-hero-collage";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { WHATSAPP_PHONE_E164 } from "@/config/store";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function ProductSearchGrid({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const whatsappIntroUrl = useMemo(
    () =>
      buildWhatsAppUrl({
        message:
          "Olá! Vi o site Poke Duwdu e gostaria de mais informações sobre as cartas.",
        phoneE164: WHATSAPP_PHONE_E164,
      }),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-blue-950/10 bg-card shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] ring-1 ring-blue-950/6 dark:border-blue-500/15 dark:shadow-none dark:ring-white/10">
        {/* Decoração estilo sites oficiais Pokémon: luz suave + toques de cor da marca */}
        <div
          className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-linear-to-br from-red-500/12 via-orange-400/6 to-transparent blur-3xl dark:from-red-500/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-20 h-64 w-64 rounded-full bg-linear-to-tr from-sky-400/18 via-blue-500/8 to-transparent blur-3xl dark:from-sky-500/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(240,249,255,0.9)_0%,rgba(255,255,255,0.98)_38%,rgba(255,250,250,0.85)_100%)] dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.97)_0%,rgba(30,41,59,0.92)_45%,rgba(15,23,42,0.98)_100%)]"
          aria-hidden
        />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="min-w-0 flex-1 space-y-6">
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-950/70 shadow-sm backdrop-blur-sm dark:border-sky-500/25 dark:bg-slate-900/60 dark:text-sky-200/90">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.25)]"
                    aria-hidden
                  />
                  Marketplace
                  <span className="text-muted-foreground/80">•</span>
                  <span className="font-medium normal-case tracking-normal text-foreground/90">
                    Pokémon TCG
                  </span>
                </p>
                <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  <span className="bg-linear-to-r from-blue-950 via-blue-900 to-blue-950 bg-clip-text text-transparent dark:from-sky-100 dark:via-white dark:to-sky-100">
                    Poke Duwdu
                  </span>
                </h1>
                <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  Fotos reais do produto e referência oficial da carta. Foco no{" "}
                  <span className="font-medium text-foreground/90">
                    Pokémon TCG
                  </span>{" "}
                  (jogo de cartas principal) — sem Pokémon TCG Pocket.
                </p>
              </div>

              <div className="w-full max-w-md space-y-2">
                <label className="sr-only" htmlFor="search">
                  Buscar por nome
                </label>
                <Input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nome da carta…"
                  className="h-12 rounded-2xl border-blue-950/10 bg-white/90 pl-4 text-foreground shadow-md shadow-blue-950/5 ring-0 transition-[box-shadow,border-color] placeholder:text-muted-foreground focus-visible:border-blue-500/35 focus-visible:ring-2 focus-visible:ring-blue-500/25 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20 dark:focus-visible:border-sky-500/40 dark:focus-visible:ring-sky-500/20"
                />
              </div>

              <div className="flex flex-wrap gap-2.5 text-xs">
                <a
                  href={whatsappIntroUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    badgeVariants({ variant: "outline" }),
                    "rounded-full border-blue-950/12 bg-white/80 px-3 py-1.5 font-medium shadow-sm backdrop-blur-sm transition-colors hover:border-blue-500/25 hover:bg-blue-50/80 dark:border-white/12 dark:bg-slate-900/50 dark:hover:bg-slate-800/80",
                  )}
                >
                  Envio combinado via WhatsApp
                </a>
                <Badge
                  variant="outline"
                  className="rounded-full border-blue-950/12 bg-white/80 px-3 py-1.5 font-medium shadow-sm backdrop-blur-sm dark:border-white/12 dark:bg-slate-900/50"
                >
                  Pagamento Pix
                </Badge>
              </div>
            </div>

            {/* Ilustração decorativa — sem rótulo; moldura lembra carta de TCG */}
            <div className="mx-auto flex w-full max-w-[200px] shrink-0 justify-center sm:max-w-[220px] lg:mx-0 lg:max-w-[240px]">
              <div
                className="relative w-full overflow-hidden rounded-2xl bg-linear-to-b from-white/90 to-sky-50/50 p-2 shadow-lg shadow-blue-950/10 ring-2 ring-blue-500/15 dark:from-slate-800/90 dark:to-slate-900/80 dark:shadow-black/30 dark:ring-sky-500/20"
                style={{ aspectRatio: "63 / 88" }}
              >
                <div
                  className="pointer-events-none absolute inset-0 z-10 opacity-[0.35]"
                  aria-hidden
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 50% at 50% 0%,rgba(59,130,246,0.15),transparent 55%),radial-gradient(circle at 80% 90%,rgba(239,68,68,0.06),transparent 45%)",
                  }}
                />
                {/* Preenchimento total do retângulo + zoom leve (crop nas bordas) */}
                <div className="absolute inset-2 overflow-hidden rounded-xl bg-linear-to-br from-slate-100/90 to-sky-100/40 dark:from-slate-800/80 dark:to-slate-900/60">
                  <Gen1HeroCollage className="drop-shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-card p-10 text-center text-sm text-muted-foreground ring-1 ring-border">
          Nenhuma carta encontrada para “{query}”.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
