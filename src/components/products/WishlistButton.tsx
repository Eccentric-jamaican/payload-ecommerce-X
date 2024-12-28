"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/payload-types";
import { useWishlist } from "@/providers/WishlistProvider";
import { Heart } from "lucide-react";
import { FC } from "react";

interface WishlistButtonProps {
  product: Product;
  variant?: "default" | "outline" | "ghost";
}

export const WishlistButton: FC<WishlistButtonProps> = ({
  product,
  variant = "ghost",
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className="h-8 w-8"
      onClick={handleClick}
    >
      <Heart
        className={`h-4 w-4 ${
          isInWishlist(product.id)
            ? "fill-primary text-primary"
            : "text-muted-foreground"
        }`}
      />
    </Button>
  );
};
