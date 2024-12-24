import { SignIn } from "@/components/auth/signin";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your account to access your digital assets and manage your purchases.",
  openGraph: {
    title: "Sign In",
    description:
      "Sign in to your account to access your digital assets and manage your purchases.",
  },
  twitter: {
    title: "Sign In",
    description:
      "Sign in to your account to access your digital assets and manage your purchases.",
  },
};

export default function SignInPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
