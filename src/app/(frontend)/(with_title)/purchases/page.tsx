import PurchasesPageClient from "./page.client";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { cookies } from "next/headers";
import { Transaction } from "@/payload-types";

const PurchasesPage = async () => {
  const transactions = await getTransactions();

  return <PurchasesPageClient transactions={transactions} />;
};

export default PurchasesPage;

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

const getTransactions = async () => {
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
        const { docs } = await payload.find({
          collection: "transactions",
          where: {
            buyer: {
              equals: user.id,
            },
            status: {
              equals: "completed",
            },
          },
          sort: "-createdAt",
          depth: 3,
        });
        transactions = docs;
      }
    } catch (error: Error | unknown) {
      console.error("Error fetching transactions:", error);
    }
  }

  return transactions;
};
