import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { CartItem } from "@/providers/CartProvider";

export async function POST(req: Request) {
  try {
    const { code, cartTotal, items } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Discount code is required" },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config: configPromise });

    // Find the discount code
    const discountCodes = await payload.find({
      collection: "discount-codes",
      where: {
        code: { equals: code.toUpperCase() },
        isActive: { equals: true },
      },
    });

    if (!discountCodes.docs.length) {
      return NextResponse.json(
        { error: "Invalid discount code" },
        { status: 400 },
      );
    }

    const discountCode = discountCodes.docs[0];

    // Check if code has expired
    if (discountCode.endDate && new Date(discountCode.endDate) < new Date()) {
      return NextResponse.json(
        { error: "Discount code has expired" },
        { status: 400 },
      );
    }

    // Check if code is not yet valid
    if (
      discountCode.startDate &&
      new Date(discountCode.startDate) > new Date()
    ) {
      return NextResponse.json(
        { error: "Discount code is not yet valid" },
        { status: 400 },
      );
    }

    // Check max uses
    if (
      discountCode.maxUses &&
      discountCode.usedCount >= discountCode.maxUses
    ) {
      return NextResponse.json(
        { error: "Discount code has reached maximum uses" },
        { status: 400 },
      );
    }

    // Check minimum purchase amount
    if (
      discountCode.minPurchaseAmount &&
      cartTotal < discountCode.minPurchaseAmount
    ) {
      return NextResponse.json(
        {
          error: `Minimum purchase amount of ${discountCode.minPurchaseAmount} required`,
        },
        { status: 400 },
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discountCode.type === "percentage") {
      discountAmount = (cartTotal * discountCode.value) / 100;
    } else {
      discountAmount = discountCode.value;
    }

    // If the discount applies to specific products/categories, filter the applicable items
    if (discountCode.appliesTo?.length) {
      const applicableProducts = new Set();
      const applicableCategories = new Set();

      discountCode.appliesTo.forEach((item) => {
        if (item.relationTo === "products") {
          applicableProducts.add(item.value);
        } else if (item.relationTo === "categories") {
          applicableCategories.add(item.value);
        }
      });

      // Filter cart items and recalculate discount
      const applicableTotal = items.reduce((total: number, item: CartItem) => {
        if (
          applicableProducts.has(item.product.id) ||
          (item.product.category &&
            applicableCategories.has(item.product.category))
        ) {
          return total + item.product.price * item.quantity;
        }
        return total;
      }, 0);

      if (discountCode.type === "percentage") {
        discountAmount = (applicableTotal * discountCode.value) / 100;
      }
    }

    return NextResponse.json({
      success: true,
      discount: {
        code: discountCode.code,
        type: discountCode.type,
        value: discountCode.value,
        discountAmount: Math.round(discountAmount * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Error validating discount code:", error);
    return NextResponse.json(
      { error: "Failed to validate discount code" },
      { status: 500 },
    );
  }
}
