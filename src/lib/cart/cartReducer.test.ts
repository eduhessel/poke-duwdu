import { describe, expect, it } from "vitest";
import { cartReducer } from "./cartReducer";
import { EMPTY_CART } from "./cartTypes";

describe("cartReducer", () => {
  it("adds items and increments quantity", () => {
    const s1 = cartReducer(EMPTY_CART, { type: "addItem", productId: "a" });
    expect(s1.items).toEqual([{ productId: "a", quantity: 1 }]);

    const s2 = cartReducer(s1, { type: "addItem", productId: "a" });
    expect(s2.items).toEqual([{ productId: "a", quantity: 2 }]);
  });

  it("removes items", () => {
    const s1 = { items: [{ productId: "a", quantity: 2 }] };
    const s2 = cartReducer(s1, { type: "removeItem", productId: "a" });
    expect(s2.items).toEqual([]);
  });

  it("clamps quantity to >= 1", () => {
    const s1 = cartReducer(EMPTY_CART, { type: "addItem", productId: "a" });
    const s2 = cartReducer(s1, { type: "setQuantity", productId: "a", quantity: 0 });
    expect(s2.items[0]?.quantity).toBe(1);
  });
});

