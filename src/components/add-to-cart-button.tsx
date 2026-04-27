"use client";

import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart/cartContext";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ product }: { product: Product }) {
  const { dispatch } = useCart();

  return (
    <Button
      type="button"
      onClick={() => dispatch({ type: "addItem", productId: product.id })}
      className="h-11 rounded-2xl px-5"
    >
      Adicionar ao carrinho
    </Button>
  );
}

