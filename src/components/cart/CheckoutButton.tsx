"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/CartProvider";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAuthToken } from "@/actions/auth";

export const CheckoutButton: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { items, discount } = useCart();
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // Get auth token if user is logged in
      const token = await getAuthToken();

      const response = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
        body: JSON.stringify({
          cartItems: items,
          discount: discount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: Error | unknown) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Checkout failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || items.length === 0}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Checkout"
      )}
    </Button>
  );
};
