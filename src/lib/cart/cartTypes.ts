import type { Product } from "@/data/products";

export type CartItem = {
  productId: Product["id"];
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: "addItem"; productId: Product["id"] }
  | { type: "removeItem"; productId: Product["id"] }
  | { type: "setQuantity"; productId: Product["id"]; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState };

export const CART_STORAGE_KEY = "pokeDuwdu.cart.v1";

export const EMPTY_CART: CartState = { items: [] };

