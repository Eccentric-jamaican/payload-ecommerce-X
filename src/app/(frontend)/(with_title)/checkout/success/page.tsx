import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import Stripe from "stripe";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Thank you for your purchase!",
  robots: {
    index: false,
    follow: false,
  },
};

async function getSessionAndCreateTransaction(sessionId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
  });

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });

  if (!session?.metadata?.userId) {
    throw new Error("Invalid session - no user ID found");
  }

  const payload = await getPayload({ config: configPromise });

  try {
    if (!session?.metadata?.productIds) {
      throw new Error("No product IDs found in session metadata");
    }

    const productIds = JSON.parse(session.metadata.productIds);

    if (productIds.length === 0) {
      throw new Error("No products found in session");
    }

    // Create a single transaction record with all products
    await payload.create({
      collection: "transactions",
      data: {
        orderId: session.id,
        buyer: session.metadata!.userId,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        status: "completed",
        paymentMethod: "stripe",
        stripeSessionId: session.id,
        products: productIds,
      },
    });
  } finally {
    // Always attempt to clear the cart, even if transaction creation fails
    try {
      const existingCarts = await payload.find({
        collection: "carts",
        where: {
          user: {
            equals: session.metadata.userId,
          },
        },
      });

      if (existingCarts.docs.length > 0) {
        await payload.delete({
          collection: "carts",
          id: existingCarts.docs[0].id,
        });
      }
    } catch (error: Error | unknown) {
      console.error("Failed to clear cart:", error);
    }
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const sessionId = (await searchParams).session_id;

  if (!sessionId) {
    redirect("/");
  }

  try {
    await getSessionAndCreateTransaction(sessionId);
  } catch (error: Error | unknown) {
    console.error("Error processing successful checkout:", error);
    // Still show success page to user, but log the error
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center py-10">
      <div className="text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h1 className="mb-4 text-2xl font-bold">
          Thank you for your purchase!
        </h1>
        <p className="mb-8 text-muted-foreground">
          Your order has been confirmed and you will receive an email with your
          order details.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/account/downloads">View Downloads</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
