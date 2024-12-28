"use server";

import { getServerUrl } from "@/lib/utils";
import { CartItem } from "@/providers/CartProvider";
import { getAuthToken } from "./auth";

export const handleCheckout = async (items: CartItem[]) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${getServerUrl()}/api/v1/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        cartItems: items,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create checkout session");
    }

    if (!data.url) {
      throw new Error("No checkout URL returned");
    }

    return data.url;
  } catch (error: Error | unknown) {
    console.error("Checkout Error:", error);
    throw error;
  }
};
