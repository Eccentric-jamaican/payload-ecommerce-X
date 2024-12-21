import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const categories = await payload.find({
      collection: "categories",
      depth: 1,
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
