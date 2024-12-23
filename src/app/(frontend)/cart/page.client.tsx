"use client";

import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, MinusCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { getAuthToken } from "@/actions/auth";

const CartPageClient = () => {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
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

  if (itemCount === 0) {
    return (
      <div className="container mx-auto py-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Your Cart is Empty</h1>
          <p className="mb-4">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="mb-8 text-2xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      {item.product.images?.[0]?.url && (
                        <div className="relative h-16 w-16">
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="rounded object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(item.product.price)}</TableCell>
                  <TableCell>
                    {formatPrice(item.product.price * item.quantity)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="lg:col-span-4">
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items ({itemCount})</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={user ? handleCheckout : undefined}
              asChild={!user}
              disabled={items.length === 0}
            >
              {user ? (
                "Proceed to Checkout"
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/signin?redirect=${encodeURIComponent("/cart")}`}
                  >
                    Login to Checkout
                  </Link>
                  <p className="text-center text-sm text-muted-foreground">
                    or{" "}
                    <Link
                      href={`/signup?redirect=${encodeURIComponent("/cart")}`}
                      className="text-primary hover:underline"
                    >
                      create an account
                    </Link>
                  </p>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageClient;
