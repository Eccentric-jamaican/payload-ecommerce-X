import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const technologies = await payload.find({
      collection: "technologies",
      depth: 1,
    });

    return NextResponse.json(technologies);
  } catch (error) {
    console.error("Failed to fetch technologies:", error);
    return NextResponse.json(
      { error: "Failed to fetch technologies" },
      { status: 500 },
    );
  }
}
