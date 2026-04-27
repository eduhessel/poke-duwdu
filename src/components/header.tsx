"use client";

import Link from "next/link";
import { Container } from "@/components/container";
import { MasterBallIcon } from "@/components/master-ball-icon";
import { useCart } from "@/lib/cart/cartContext";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/75 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-card-strong ring-1 ring-border">
            <MasterBallIcon className="h-[1.65rem] w-[1.65rem]" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Poke Duwdu
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/how-to-buy"
            className="hidden rounded-full px-3 py-2 text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            Como comprar
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center rounded-full bg-card px-4 py-2 text-foreground ring-1 ring-border hover:bg-card-strong"
          >
            Carrinho
            {totalItems > 0 ? (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                {totalItems}
              </span>
            ) : null}
          </Link>
        </nav>
      </Container>
    </header>
  );
}

