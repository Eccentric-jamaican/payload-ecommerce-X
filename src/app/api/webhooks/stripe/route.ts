import { handleStripeWebhook } from "@/webhooks/stripeWebhook";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const response = await handleStripeWebhook(req);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
