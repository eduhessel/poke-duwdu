import { EMPTY_CART, type CartAction, type CartState } from "./cartTypes";

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.floor(quantity));
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "clear":
      return EMPTY_CART;
    case "addItem": {
      const existing = state.items.find((i) => i.productId === action.productId);
      if (!existing) {
        return { items: [...state.items, { productId: action.productId, quantity: 1 }] };
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    case "removeItem": {
      return { items: state.items.filter((i) => i.productId !== action.productId) };
    }
    case "setQuantity": {
      const q = clampQuantity(action.quantity);
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: q } : i
        ),
      };
    }
    default: {
      const _exhaustive: never = action;
      void _exhaustive;
      return state;
    }
  }
}

