"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
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
import { handleCheckout as gotoCheckout } from "@/actions/checkout";
import { formatPrice } from "@/lib/utils";

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
          {formatPrice(item.product.price)} x {item.quantity}
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
      const url = await gotoCheckout(items);

      if (!url) {
        throw new Error("No checkout URL returned");
      }

      window.location.href = url;
    } catch (error: Error | unknown) {
      toast({
        title: "Checkout Error",
        description:
          error instanceof Error ? error.message : "Failed to checkout",
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
          <div className="flex-1 overflow-y-auto px-4">
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

          <div className="border-t bg-card px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-sm font-medium">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Shipping and taxes will be calculated at checkout.
            </p>
            <div className="flex flex-col gap-2">
              {user ? (
                <Button
                  className="group w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <div className="space-y-3">
                  <SheetClose asChild>
                    <Button className="w-full" asChild size="lg">
                      <Link
                        href={`/signin?redirect=${encodeURIComponent("/cart")}`}
                      >
                        Login to Checkout
                      </Link>
                    </Button>
                  </SheetClose>
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <SheetClose asChild>
                      <Link
                        href={`/signup?redirect=${encodeURIComponent("/cart")}`}
                        className="font-medium text-primary hover:underline"
                      >
                        Sign up
                      </Link>
                    </SheetClose>
                  </p>
                </div>
              )}
              <SheetClose asChild>
                <Button variant="outline" className="w-full" asChild size="lg">
                  <Link href={`/cart`}>Goto Cart</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
