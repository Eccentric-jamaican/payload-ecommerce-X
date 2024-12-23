import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - No auth header" },
        { status: 401 },
      );
    }

    const payload = await getPayload({ config: configPromise });
    const { user } = await payload.auth({
      headers: new Headers({
        authorization: authHeader,
      }),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 },
      );
    }

    // Fetch all products and their prices
    const lineItems = await Promise.all(
      items.map(async (item: { productId: string; quantity: number }) => {
        const product = await payload.findByID({
          collection: "products",
          id: item.productId,
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (!product.stripeID) {
          throw new Error(`Product ${product.name} is not synced with Stripe`);
        }

        // Get the default price for the product
        const prices = await stripe.prices.list({
          product: product.stripeID as string,
          active: true,
          limit: 1,
        });

        if (prices.data.length === 0) {
          throw new Error(`No active price found for product: ${product.name}`);
        }

        return {
          price: prices.data[0].id,
          quantity: item.quantity,
          productId: item.productId,
        };
      }),
    );

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: lineItems.map(({ price, quantity }) => ({ price, quantity })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
      metadata: {
        userId: user.id,
        productIds: JSON.stringify(lineItems.map((item) => item.productId)),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
