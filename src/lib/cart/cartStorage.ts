import { CART_STORAGE_KEY, EMPTY_CART, type CartState } from "./cartTypes";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function loadCartFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return EMPTY_CART;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed.items)) return EMPTY_CART;

    const items = parsed.items
      .map((item: unknown) => {
        if (!isRecord(item)) return null;
        const { productId, quantity } = item;
        if (typeof productId !== "string") return null;
        if (typeof quantity !== "number" || !Number.isFinite(quantity) || quantity < 1)
          return null;
        return { productId, quantity: Math.floor(quantity) };
      })
      .filter((i): i is { productId: string; quantity: number } => i !== null);

    return { items };
  } catch {
    return EMPTY_CART;
  }
}

export function saveCartToStorage(state: CartState): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota/blocked storage
  }
}

