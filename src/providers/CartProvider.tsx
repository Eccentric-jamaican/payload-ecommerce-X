"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DigitalProduct } from "@/payload-types";
import { useAuth } from "./AuthProvider";
import { loadCart, saveCart } from "@/actions/cart";
import { useToast } from "@/components/ui/use-toast";

export interface CartItem {
  product: DigitalProduct & {
    images?: Array<{ url: string }>;
  };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: DigitalProduct, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart from server or localStorage
  useEffect(() => {
    const loadUserCart = async () => {
      try {
        setIsLoading(true);
        if (user) {
          // Load from server if user is logged in
          const result = await loadCart();
          if (result.success) {
            setItems(result?.data || []);
          } else {
            throw new Error(result.error);
          }
        } else {
          // Load from localStorage if no user
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            try {
              setItems(JSON.parse(savedCart));
            } catch (error) {
              console.error("Failed to parse saved cart:", error);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCart();
  }, [user, toast]);

  // Save cart to server or localStorage when it changes
  useEffect(() => {
    const saveUserCart = async () => {
      if (user) {
        // Save to server if user is logged in
        try {
          await saveCart(items);
        } catch (error) {
          console.error("Failed to save cart:", error);
          toast({
            title: "Error",
            description: "Failed to save your cart",
            variant: "destructive",
          });
        }
      } else {
        // Save to localStorage if no user
        localStorage.setItem("cart", JSON.stringify(items));
      }
    };

    if (!isLoading) {
      saveUserCart();
    }
  }, [items, user, isLoading, toast]);

  const addItem = (product: DigitalProduct, quantity: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        // Update quantity if item exists
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      // Add new item if it doesn't exist
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
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const total = subtotal; // You can add tax, shipping, etc. here later

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
