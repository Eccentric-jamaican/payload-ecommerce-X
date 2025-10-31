import { SignUp } from "@/components/auth/signup";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Request access to Alphamed Global's client portal and content tools.",
  openGraph: {
    title: "Sign Up",
    description:
      "Request access to Alphamed Global's client portal and content tools.",
  },
  twitter: {
    title: "Sign Up",
    description:
      "Request access to Alphamed Global's client portal and content tools.",
  },
};

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
