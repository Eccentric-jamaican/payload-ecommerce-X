"use client";

import { getAuthToken } from "@/actions/auth";
import { DiscountCode } from "@/components/cart/DiscountCode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import {
  ArrowRight,
  Clock,
  CreditCard,
  MinusCircle,
  PlusCircle,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CartPageClient = () => {
  const { items, removeItem, updateQuantity, subtotal, total, discount } =
    useCart();
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
          cartItems: items,
          discount: discount,
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

  if (items.length === 0) {
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
    <div className="container mx-auto">
      <div className="relative mb-10 bg-background">
        <div className="pt-8">
          <h1 className="text-4xl font-bold md:text-5xl">Shopping Cart</h1>
        </div>
      </div>

      <div className="grid gap-8 py-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[440px] py-4">Product</TableHead>
                  <TableHead className="py-4">Quantity</TableHead>
                  <TableHead className="py-4">Price</TableHead>
                  <TableHead className="py-4">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.product.id}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell className="py-6">
                      <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                          {item.product.previewImages?.[0]?.image &&
                          typeof item.product.previewImages[0].image !==
                            "string" &&
                          item.product.previewImages[0].image.url ? (
                            <Image
                              src={item.product.previewImages[0].image.url}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          ) : (
                            <div className="flex h-24 w-24 items-center justify-center bg-gray-100">
                              <span className="text-xs text-muted-foreground">
                                {item.product.name[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {item.product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatPrice(item.product.price)}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatPrice(item.product.price * item.quantity)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          {/* Main Summary Card */}
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <h2 className="flex items-center justify-between text-lg font-semibold">
                <span>Order Summary</span>
                <Badge variant="secondary" className="font-medium">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Badge>
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Mini Cart Preview */}
                <div className="space-y-3">
                  {items.slice(0, 2).map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        {item.product.previewImages?.[0]?.image &&
                        typeof item.product.previewImages[0].image !==
                          "string" &&
                        item.product.previewImages[0].image.url ? (
                          <Image
                            src={item.product.previewImages[0].image.url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            {item.product.name[0]}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                  {items.length > 2 && (
                    <p className="pt-2 text-center text-sm text-muted-foreground">
                      And {items.length - 2} more{" "}
                      {items.length - 2 === 1 ? "item" : "items"}...
                    </p>
                  )}
                </div>

                <DiscountCode />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {discount && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Discount
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {discount.code}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium tabular-nums text-primary">
                            -{formatPrice(discount.discountAmount)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-primary">
                        You save {formatPrice(discount.discountAmount)}!
                      </p>
                    </>
                  )}

                  <div className="my-6 border-t border-dashed" />

                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold tabular-nums">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Actions */}
                <div className="space-y-4">
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
                      <Button className="w-full" asChild size="lg">
                        <Link
                          href={`/signin?redirect=${encodeURIComponent("/cart")}`}
                        >
                          Login to Checkout
                        </Link>
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                          href={`/signup?redirect=${encodeURIComponent("/cart")}`}
                          className="font-medium text-primary hover:underline"
                        >
                          Sign up
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid gap-4 text-sm">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Secure Checkout</p>
                  <p className="text-muted-foreground">Protected by Stripe</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Payment Options</p>
                    <p className="text-muted-foreground">
                      All major cards accepted
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Instant Access</p>
                    <p className="text-muted-foreground">
                      Download immediately
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageClient;
