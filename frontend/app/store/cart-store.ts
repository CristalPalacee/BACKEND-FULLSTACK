"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];

  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        const currentItems = get().items;

        const existingItem = currentItems.find(
          (cartItem) => cartItem.id === item.id
        );

        if (existingItem) {
          set({
            items: currentItems.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          });

          return;
        }

        set({
          items: [
            ...currentItems,
            {
              ...item,
              quantity: 1,
            },
          ],
        });
      },

      removeFromCart: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      increaseQuantity: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },

      decreaseQuantity: (id) => {
        set({
          items: get()
            .items.map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "game-store-cart",
    }
  )
);