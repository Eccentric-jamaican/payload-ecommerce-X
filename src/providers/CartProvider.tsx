"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useMemo,
  FC,
} from "react";
import { Product } from "@/payload-types";
import { useAuth } from "./AuthProvider";
import { loadCart, saveCart } from "@/actions/cart";
import { useToast } from "@/components/ui/use-toast";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface Discount {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  discount: Discount | null;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => void;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<Discount | null>(null);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }, [items]);

  const total = useMemo(() => {
    if (!discount) return subtotal;
    return Math.max(0, subtotal - discount.discountAmount);
  }, [subtotal, discount]);

  const addItem = (product: Product, quantity: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...currentItems, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(null);
  };

  const applyDiscount = async (code: string) => {
    try {
      const response = await fetch("/api/discount-codes/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          cartTotal: subtotal,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to apply discount code");
      }

      setDiscount(data.discount);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to apply discount code");
    }
  };

  const removeDiscount = () => {
    setDiscount(null);
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const { items: savedItems, discount: savedDiscount } =
          JSON.parse(savedCart);
        setItems(savedItems);
        setDiscount(savedDiscount);
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify({ items, discount }));
  }, [items, discount]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        discount,
        applyDiscount,
        removeDiscount,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
