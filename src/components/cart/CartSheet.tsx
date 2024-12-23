"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/providers/CartProvider";
import type { CartItem } from "@/providers/CartProvider";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { getAuthToken } from "@/actions/auth";

interface CartItemProps {
  item: CartItem;
}

const CartItemComponent: FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
        {item.product.previewImages?.[0]?.image &&
        typeof item.product.previewImages[0].image !== "string" &&
        item.product.previewImages[0].image.url ? (
          <Image
            src={item.product.previewImages[0].image.url}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="text-sm font-medium">{item.product.name}</h3>
        <p className="text-sm text-muted-foreground">
          £{item.product.price.toFixed(2)} x {item.quantity}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() =>
              updateQuantity(item.product.id, Math.max(0, item.quantity - 1))
            }
          >
            -
          </Button>
          <span className="text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => removeItem(item.product.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface CartSheetProps {
  children: React.ReactNode;
}

export const CartSheet: FC<CartSheetProps> = ({ children }) => {
  const { items, subtotal } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to checkout",
          variant: "destructive",
        });
        return;
      }

      const token = await getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication error. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (!data.url) {
        throw new Error("No checkout URL returned");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:w-[400px]"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6">
            {items.length > 0 ? (
              <div className="divide-y">
                {items.map((item) => (
                  <CartItemComponent key={item.product.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex h-[450px] flex-col items-center justify-center space-y-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg font-medium text-muted-foreground">
                  Your cart is empty
                </p>
                <SheetClose asChild>
                  <Button asChild variant="secondary">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </SheetClose>
              </div>
            )}
          </div>

          <div className="border-t bg-white px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-sm font-medium">
                £{subtotal.toFixed(2)}
              </span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Shipping and taxes will be calculated at checkout.
            </p>
            <div className="flex flex-col gap-2">
              {user ? (
                <SheetClose asChild>
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                  >
                    Checkout
                  </Button>
                </SheetClose>
              ) : (
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button
                      className="w-full"
                      asChild
                      disabled={items.length === 0}
                    >
                      <Link
                        href={`/signin?redirect=${encodeURIComponent("/cart")}`}
                      >
                        Login to Checkout
                      </Link>
                    </Button>
                  </SheetClose>
                  <p className="text-center text-sm text-muted-foreground">
                    or{" "}
                    <SheetClose asChild>
                      <Link
                        href={`/signup?redirect=${encodeURIComponent("/cart")}`}
                        className="text-primary hover:underline"
                      >
                        create an account
                      </Link>
                    </SheetClose>
                  </p>
                </div>
              )}
              <SheetClose asChild>
                <Button
                  asChild
                  variant="secondary"
                  disabled={items.length === 0}
                >
                  <Link href="/cart" className="w-full">
                    View Cart
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
