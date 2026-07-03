"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProductById, products, type Product } from "@/lib/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "palestina-cart";

type StoredItem = {
  id: string;
  quantity: number;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [storedItems, setStoredItems] = useState<StoredItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as StoredItem[];
          setStoredItems(parsed.filter((item) => getProductById(item.id)));
        } catch {
          setStoredItems([]);
        }
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(storedItems));
    }
  }, [hydrated, storedItems]);

  const items = useMemo(
    () =>
      storedItems
        .map((item) => {
          const product = products.find((current) => current.id === item.id);
          return product ? { product, quantity: item.quantity } : null;
        })
        .filter(Boolean) as CartItem[],
    [storedItems]
  );

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: Product) => {
      setStoredItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...current, { id: product.id, quantity: 1 }];
      });
    };

    const removeItem = (productId: string) => {
      setStoredItems((current) => current.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
      setStoredItems((current) =>
        current
          .map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
          .filter((item) => item.quantity > 0)
      );
    };

    return {
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      clearCart: () => setStoredItems([])
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}
