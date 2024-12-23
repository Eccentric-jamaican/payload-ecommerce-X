import { Metadata } from "next";
import CartPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and manage the items in your shopping cart.",
  openGraph: {
    title: "Shopping Cart",
    description: "View and manage the items in your shopping cart.",
  },
  twitter: {
    title: "Shopping Cart",
    description: "View and manage the items in your shopping cart.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
