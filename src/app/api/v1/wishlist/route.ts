import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { Product } from "@/payload-types";
import { headers } from "next/headers";
import { getAuthToken } from "@/actions/auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  const payload = await getPayload({ config: configPromise });
  const token = await getAuthToken();
  const headersList = await headers();
  if (!token) {
    return NextResponse.json({ success: true, data: [] }, { status: 200 });
  }

  const { user } = await payload.auth({
    headers: headersList,
  });

  try {
    const wishlist = await payload.find({
      collection: "wishlists",
      where: {
        user: {
          equals: user?.id,
        },
      },
    });

    if (wishlist.docs.length === 0) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 },
      );
    }

    const updatedProducts = (wishlist.docs[0].products || []).filter(
      (id: string | Product) => typeof id === "string" && id !== productId,
    );

    await payload.update({
      collection: "wishlists",
      id: wishlist.docs[0].id,
      data: {
        products: updatedProducts,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: Error | unknown) {
    console.error("Wishlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
