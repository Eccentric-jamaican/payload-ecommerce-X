"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Loader2, X } from "lucide-react";

export const DiscountCode: FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { applyDiscount, removeDiscount, discount } = useCart();

  const handleApplyDiscount = async () => {
    if (!code.trim()) return;

    try {
      setError("");
      setIsLoading(true);
      await applyDiscount(code.trim());
      setCode("");
    } catch (error: Error | unknown) {
      setError(error instanceof Error ? error.message : "Failed to apply code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {discount ? (
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Discount applied</p>
              <p className="text-xs text-muted-foreground">
                Code: {discount.code}
                {discount.type === "percentage"
                  ? ` (${discount.value}% off)`
                  : ` (${formatPrice(discount.value)} off)`}
              </p>
              <p className="mt-1 text-sm font-medium text-primary">
                -{formatPrice(discount.discountAmount)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeDiscount}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter discount code"
              value={code}
              onChange={(e) => {
                setError("");
                setCode(e.target.value.toUpperCase());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleApplyDiscount();
                }
              }}
              className="uppercase"
            />
            <Button
              onClick={handleApplyDiscount}
              disabled={isLoading || !code.trim()}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
};
