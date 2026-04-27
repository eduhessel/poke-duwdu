"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { cartReducer } from "./cartReducer";
import { loadCartFromStorage, saveCartToStorage } from "./cartStorage";
import { EMPTY_CART, type CartAction, type CartState } from "./cartTypes";

type CartContextValue = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART);

  useEffect(() => {
    dispatch({ type: "hydrate", state: loadCartFromStorage() });
  }, []);

  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);

  const totalItems = useMemo(
    () => state.items.reduce((acc, item) => acc + item.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({ state, dispatch, totalItems }),
    [dispatch, state, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

