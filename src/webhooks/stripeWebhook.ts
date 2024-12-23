import { Octokit } from "@octokit/rest";
import type Stripe from "stripe";
import payload from "payload";
import { stripe } from "../lib/stripe";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type WebhookData = {
  id: string;
  products: Array<{ id: string }>;
  buyer: { id: string; email: string };
};

type ProductData = {
  productType: string;
  githubDetails?: {
    repositoryOwner: string;
    repositoryName: string;
    githubAccessToken: string;
  };
  seller: { id: string } | string;
};

export const handleStripeWebhook = async (req: NextRequest) => {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET;

  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(await req.text(), sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as Stripe.Checkout.Session;

      // Find transaction
      const { docs } = await payload.find({
        collection: "transactions",
        where: {
          stripeSessionId: { equals: session.id },
        },
      });

      if (!docs.length) {
        return NextResponse.json(
          { error: "Transaction not found" },
          { status: 404 },
        );
      }

      const transaction = docs[0] as WebhookData;

      // Update transaction status
      await payload.update({
        collection: "transactions",
        id: transaction.id,
        data: { status: "completed" },
      });

      // Get products
      const productIds = transaction["products"].map((p) => p.id);
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: { in: productIds },
        },
      });

      // Process GitHub invites
      for (const product of products as ProductData[]) {
        if (product.productType === "github-repo" && product.githubDetails) {
          const { repositoryOwner, repositoryName, githubAccessToken } =
            product.githubDetails;
          const sellerId =
            typeof product.seller === "string"
              ? product.seller
              : product.seller.id;

          try {
            const octokit = new Octokit({ auth: githubAccessToken });

            // Add collaborator
            await octokit.repos.addCollaborator({
              owner: repositoryOwner,
              repo: repositoryName,
              username: transaction.buyer.email,
              permission: "read",
            });

            // Notify buyer
            await payload.create({
              collection: "notifications",
              data: {
                user: transaction.buyer.id,
                message: `You've been invited to the GitHub repository: ${repositoryOwner}/${repositoryName}. Check your email for the invitation.`,
                type: "order_update",
              },
            });
          } catch (err) {
            // Log error and notify seller
            console.error("GitHub API Error:", err);
            await payload.create({
              collection: "notifications",
              data: {
                user: sellerId,
                message: `Failed to invite ${transaction.buyer.email} to repository ${repositoryOwner}/${repositoryName}. Error: ${(err as Error).message}`,
                type: "order_update",
              },
            });
          }
        }
      }

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Webhook processing error:", err);
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
};
