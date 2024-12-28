"use server";

import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { headers } from "next/headers";
import { getAuthToken } from "./auth";

export async function loadWishlist() {
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

    const wishlists = await payload.find({
      collection: "wishlists",
      where: {
        user: {
          equals: user.id,
        },
      },
      depth: 2,
    });

    if (wishlists.docs.length > 0) {
      const wishlist = wishlists.docs[0];
      return {
        success: true,
        data: wishlist.products,
      };
    }

    return { success: true, data: [] };
  } catch (error: Error | unknown) {
    console.error("Load wishlist error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load wishlist",
      data: [],
    };
  }
}
