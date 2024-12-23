import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { CartItem } from "@/providers/CartProvider";
import { Media } from "@/payload-types";

export async function POST(req: Request) {
  try {
    const { cartItems, discount } = await req.json();
    const authHeader = req.headers.get("authorization");

    if (!cartItems?.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    // Get user if authenticated
    let user = null;
    if (authHeader) {
      try {
        const { user: authUser } = await payload.auth({
          headers: new Headers({
            authorization: authHeader,
          }),
        });
        user = authUser;
      } catch (error) {
        console.error("Auth error:", error);
      }
    }

    // Verify all products exist and are active
    const productIds = cartItems.map((item: CartItem) => item.product.id);
    const products = await payload.find({
      collection: "products",
      where: {
        id: { in: productIds },
        status: { equals: "published" },
      },
    });

    if (products.docs.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products are no longer available" },
        { status: 400 },
      );
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item: CartItem) => {
      const image = item.product.previewImages?.[0]?.image;
      const imageUrl = typeof image !== "string" && (image as Media)?.url;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            description: item.product.description,
            images: imageUrl ? [imageUrl] : undefined,
          },
          unit_amount: item.product.price * 100, // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Handle discount
    let discountOptions = {};
    if (discount) {
      if (discount.type === "percentage") {
        discountOptions = {
          discounts: [
            {
              coupon: await getOrCreatePercentageCoupon(discount.value),
            },
          ],
        };
      } else {
        // For fixed amount discounts, we'll apply it as a negative line item
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Discount",
              description: `Discount code: ${discount.code}`,
            },
            unit_amount: -discount.discountAmount * 100, // Negative amount
          },
          quantity: 1,
        });
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
      metadata: {
        userId: user?.id || "guest",
        discountCode: discount?.code,
      },
      customer_email: user?.email,
      ...discountOptions,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}

async function getOrCreatePercentageCoupon(percentage: number) {
  const couponId = `PERCENT_${percentage}`;

  try {
    // Try to retrieve existing coupon
    const existingCoupon = await stripe.coupons.retrieve(couponId);
    return existingCoupon.id;
  } catch (error) {
    // Create new coupon if it doesn't exist
    const coupon = await stripe.coupons.create({
      id: couponId,
      percent_off: percentage,
      duration: "once",
    });
    return coupon.id;
  }
}
