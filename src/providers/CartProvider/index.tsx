"use client";

import { Product } from "@/payload-types";
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { saveCart, loadCart } from "@/actions/cart";
import { getAuthToken } from "@/actions/auth";

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
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  discount: Discount | null;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => void;
  subtotal: number;
  total: number;
  isInCart: (productId: string) => boolean;
  syncCartWithServer: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }, [items]);

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const total = useMemo(() => {
    if (!discount) return subtotal;
    return Math.max(0, subtotal - discount.discountAmount);
  }, [subtotal, discount]);

  const addItem = async (product: Product, quantity: number) => {
    const newItems = [...items];
    const existingItem = newItems.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      newItems.push({ product, quantity });
    }

    setItems(newItems);

    // Try to sync with server if user is logged in
    try {
      const token = await getAuthToken();
      if (token) {
        await saveCart(newItems);
      }
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
    }
  };

  const removeItem = async (productId: string) => {
    const newItems = items.filter((item) => item.product.id !== productId);
    setItems(newItems);

    // Try to sync with server if user is logged in
    try {
      const token = await getAuthToken();
      if (token) {
        await saveCart(newItems);
      }
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(productId);
      return;
    }

    const newItems = items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );
    setItems(newItems);

    // Try to sync with server if user is logged in
    try {
      const token = await getAuthToken();
      if (token) {
        await saveCart(newItems);
      }
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
    }
  };

  const clearCart = async () => {
    setItems([]);
    setDiscount(null);

    // Try to sync with server if user is logged in
    try {
      const token = await getAuthToken();
      if (token) {
        await saveCart([]);
      }
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
    }
  };

  const applyDiscount = async (code: string) => {
    try {
      const response = await fetch("/api/v1/discount-codes/validate", {
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
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to apply discount code");
    }
  };

  const removeDiscount = () => {
    setDiscount(null);
  };

  const syncCartWithServer = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("User not logged in");
      }

      const result = await saveCart(items);
      if (!result.success) {
        throw new Error(result.error || "Failed to sync cart");
      }

      // After successful sync, load the cart from server to ensure consistency
      const { success, data } = await loadCart();
      if (success && data) {
        setItems(data as unknown as CartItem[]);
      }
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
      throw error;
    }
  };

  // Initialize cart from localStorage and/or server
  useEffect(() => {
    const initializeCart = async () => {
      try {
        // Check if user is logged in
        const token = await getAuthToken();

        if (token) {
          // User is logged in, try to load from server first
          const { success, data } = await loadCart();
          if (success && data && data.length > 0) {
            setItems(data as unknown as CartItem[]);
            setIsInitialized(true);
            return;
          }
        }

        // If no server data or not logged in, try localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const { items: savedItems, discount: savedDiscount } =
            JSON.parse(savedCart);
          setItems(savedItems);
          setDiscount(savedDiscount);
        }
      } catch (error) {
        console.error("Failed to initialize cart:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeCart();
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("cart", JSON.stringify({ items, discount }));
  }, [items, discount, isInitialized]);

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
        isInCart,
        syncCartWithServer,
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
