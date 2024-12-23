"use server";

import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { headers } from "next/headers";
import { getAuthToken } from "./auth";
import { CartItem } from "@/providers/CartProvider";

export async function saveCart(items: CartItem[]) {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Unauthorized");
    }

    const headersList = await headers();
    const payload = await getPayload({ config: configPromise });

    const { user } = await payload.auth({
      headers: headersList,
    });

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Find existing cart for user
    const existingCarts = await payload.find({
      collection: "carts",
      where: {
        user: {
          equals: user.id,
        },
      },
    });

    const cartItems = items.map((item) => ({
      product: item.product.id,
      quantity: item.quantity,
    }));

    if (existingCarts.docs.length > 0) {
      // Update existing cart
      const cartId = existingCarts.docs[0].id;
      await payload.update({
        collection: "carts",
        id: cartId,
        data: {
          items: cartItems,
        },
      });
    } else {
      // Create new cart
      await payload.create({
        collection: "carts",
        data: {
          user: user.id,
          items: cartItems,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Save cart error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save cart",
    };
  }
}

export async function loadCart() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: true, data: [] };
    }

    const headersList = await headers();
    const payload = await getPayload({ config: configPromise });

    const { user } = await payload.auth({
      headers: headersList,
    });

    if (!user) {
      return { success: true, data: [] };
    }

    // Find cart for user
    const existingCarts = await payload.find({
      collection: "carts",
      where: {
        user: {
          equals: user.id,
        },
      },
      depth: 2, // Load product details
    });

    if (existingCarts.docs.length > 0) {
      const cart = existingCarts.docs[0];
      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: cart.items?.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };
    }

    return { success: true, data: [] };
  } catch (error) {
    console.error("Load cart error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load cart",
      data: [],
    };
  }
}
