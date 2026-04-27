"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PIX_KEY, WHATSAPP_PHONE_E164 } from "@/config/store";
import { getProducts } from "@/data/products";
import { formatBrl } from "@/lib/money";
import { useCart } from "@/lib/cart/cartContext";
import {
  buildWhatsAppCheckoutMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CartClient() {
  const { state, dispatch } = useCart();
  const products = useMemo(() => getProducts(), []);

  const lines = useMemo(() => {
    return state.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const suffix = item.quantity > 1 ? ` (x${item.quantity})` : "";
        return { product, label: `${product.name}${suffix}` };
      })
      .filter(
        (v): v is { product: (typeof products)[number]; label: string } => v !== null
      );
  }, [products, state.items]);

  const total = useMemo(() => {
    return lines.reduce((acc, { product }) => {
      const item = state.items.find((i) => i.productId === product.id);
      const qty = item?.quantity ?? 1;
      return acc + product.price * qty;
    }, 0);
  }, [lines, state.items]);

  const totalBrl = formatBrl(total);

  const whatsappMessage = useMemo(() => {
    const productLines = lines.map(({ product }) => {
      const item = state.items.find((i) => i.productId === product.id);
      const qty = item?.quantity ?? 1;
      const suffix = qty > 1 ? ` (x${qty})` : "";
      return `${product.name}${suffix} - ${formatBrl(product.price * qty)}`;
    });
    return buildWhatsAppCheckoutMessage({ lines: productLines, totalBrl });
  }, [lines, state.items, totalBrl]);

  const whatsappUrl = useMemo(() => {
    return buildWhatsAppUrl({
      message: whatsappMessage,
      phoneE164: WHATSAPP_PHONE_E164,
    });
  }, [whatsappMessage]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Carrinho
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Checkout manual: finalize pelo WhatsApp e pague via Pix.
          </p>
        </div>
        {state.items.length ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "clear" })}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Limpar
          </button>
        ) : null}
      </div>

      {state.items.length === 0 ? (
        <Card className="rounded-3xl bg-card text-center ring-border">
          <CardContent className="px-6 py-10">
            <p className="text-sm text-muted-foreground">
              Seu carrinho está vazio.
            </p>
            <Link href="/" className="mt-5 inline-flex">
              <Button className="h-11 rounded-2xl px-5">Ver cartas</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {lines.map(({ product }) => {
              const item = state.items.find((i) => i.productId === product.id);
              const qty = item?.quantity ?? 1;

              return (
                <Card
                  key={product.id}
                  className="rounded-3xl bg-card ring-border"
                >
                  <CardContent className="px-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {product.condition}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center rounded-2xl bg-background/30 ring-1 ring-border">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              dispatch({
                                type: "setQuantity",
                                productId: product.id,
                                quantity: Math.max(1, qty - 1),
                              })
                            }
                            className="h-10 w-10 rounded-2xl text-foreground hover:bg-background/40"
                            aria-label="Diminuir quantidade"
                          >
                            –
                          </Button>
                          <span className="w-10 text-center text-sm font-semibold text-foreground">
                            {qty}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              dispatch({
                                type: "setQuantity",
                                productId: product.id,
                                quantity: qty + 1,
                              })
                            }
                            className="h-10 w-10 rounded-2xl text-foreground hover:bg-background/40"
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </Button>
                        </div>
                        <p className="w-28 text-right text-sm font-semibold text-foreground">
                          {formatBrl(product.price * qty)}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            dispatch({ type: "removeItem", productId: product.id })
                          }
                          className="h-10 rounded-2xl px-3 text-muted-foreground hover:bg-background/40 hover:text-foreground"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <aside className="h-fit space-y-3 rounded-3xl bg-card p-5 ring-1 ring-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-semibold text-foreground">{totalBrl}</p>
            </div>

            <a
              href={whatsappUrl}
              className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:brightness-110"
            >
              Finalizar via WhatsApp
            </a>

            <div className="rounded-2xl bg-background/30 p-4 text-sm ring-1 ring-border">
              <p className="font-semibold text-foreground">Pagamento via Pix</p>
              <p className="mt-2 text-muted-foreground">
                Chave Pix:{" "}
                <span className="font-semibold text-foreground">{PIX_KEY}</span>
              </p>
              <p className="mt-2 text-muted-foreground">
                Envie o comprovante pelo WhatsApp após o pagamento.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

