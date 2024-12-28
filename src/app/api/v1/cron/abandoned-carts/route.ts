import { checkAbandonedCarts } from "@/actions/abandonedCart";
import { Users } from "@/collections/Users";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `${Users.slug} API-Key ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await checkAbandonedCarts(authHeader);
    return NextResponse.json(result);
  } catch (error: Error | unknown) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
