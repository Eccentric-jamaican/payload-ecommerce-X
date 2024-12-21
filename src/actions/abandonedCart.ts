"use server";

import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { DigitalProduct } from "@/payload-types";

// const CART_ABANDONMENT_THRESHOLD = 24 * 60 * 60 * 1000;

export async function checkAbandonedCarts(authHeader: string) {
  try {
    const payload = await getPayload({ config: configPromise });

    // const now = new Date();
    // const threshold = new Date(now.getTime() - CART_ABANDONMENT_THRESHOLD);

    const abandonedCarts = (
      await payload.find({
        collection: "carts",
        where: {
          and: [
            {
              abandonedEmailSent: {
                equals: false,
              },
            },
            // {
            //   lastUpdated: {
            //     less_than: threshold,
            //   },
            // },
          ],
        },
      })
    ).docs;

    for (const cart of abandonedCarts) {
      if (!cart.user || !cart.items?.length) continue;
      if (typeof cart.user === "string") {
        throw new Error("Cart is invalid");
      }

      const user = await payload.findByID({
        collection: "users",
        user: authHeader,
        id: cart.user.id as string,
      });

      if (!user?.email) continue;

      // Calculate cart total
      const total = cart.items.reduce(
        (
          sum: number,
          item: {
            product: string | DigitalProduct;
            quantity: number;
            id?: string | null;
          },
        ) => {
          return (
            sum +
            (typeof item.product !== "string"
              ? item.product.price * item.quantity
              : 0)
          );
        },
        0,
      );

      // Send email with your store's branding
      await payload.sendEmail({
        to: user.email,
        from: "hello@kilinc.digital",
        subject: "Complete Your Purchase - Items Still in Your Cart",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
                .items { margin: 20px 0; }
                .item { padding: 10px 0; border-bottom: 1px solid #eee; }
                .cta-button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #007bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  margin: 20px 0;
                }
                .footer { font-size: 12px; color: #666; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Don't Miss Out!</h1>
                  <p>We noticed you left some items in your cart</p>
                </div>

                <div class="items">
                  ${cart.items
                    .map(
                      (item) => `
                        <div class="item">
                          <p><strong>${typeof item.product !== "string" ? item.product.name : ""}</strong></p>
                          <p>Quantity: ${item.quantity}</p>
                          <p>Price: £${typeof item.product !== "string" ? item.product.price.toFixed(2) : ""}</p>
                        </div>
                      `,
                    )
                    .join("")}

                  <p><strong>Total: £${total.toFixed(2)}</strong></p>
                </div>

                <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/cart" class="cta-button">
                  Complete Your Purchase
                </a>

                <div class="footer">
                  <p>This email was sent to ${user.email}. If you don't want to receive these emails in the future, you can unsubscribe.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      // Mark email as sent
      await payload.update({
        collection: "carts",
        id: cart.id,
        data: {
          abandonedEmailSent: true,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Check abandoned carts error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check carts",
    };
  }
}
