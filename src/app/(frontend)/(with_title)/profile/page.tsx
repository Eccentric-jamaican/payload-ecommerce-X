import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { cookies } from "next/headers";
import ProfilePageClient from "./page.client";
import { Transaction } from "@/payload-types";

export const metadata = {
  title: "Profile",
  description:
    "Manage your account settings, view your purchases, and update your profile information.",
  openGraph: {
    title: "Profile",
    description:
      "Manage your account settings, view your purchases, and update your profile information.",
  },
  twitter: {
    title: "Profile",
    description:
      "Manage your account settings, view your purchases, and update your profile information.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const payload = await getPayload({ config: configPromise });
  const cookieStore = await cookies();
  const token = cookieStore.get("payload-token");

  let transactions: Transaction[] = [];

  if (token) {
    try {
      const { user } = await payload.auth({
        headers: new Headers({
          authorization: `JWT ${token.value}`,
        }),
      });

      if (user) {
        const result = await payload.find({
          collection: "transactions",
          where: {
            buyer: {
              equals: user.id,
            },
          },
          sort: "-createdAt",
        });
        transactions = result.docs;
      }
    } catch (error: Error | unknown) {
      console.error("Error fetching transactions:", error);
    }
  }

  // @ts-expect-error - TODO: fix this
  return <ProfilePageClient initialTransactions={transactions} />;
}
