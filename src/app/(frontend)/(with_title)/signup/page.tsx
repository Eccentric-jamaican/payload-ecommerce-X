import { SignUp } from "@/components/auth/signup";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create an account to start buying and selling digital assets on our marketplace.",
  openGraph: {
    title: "Sign Up",
    description:
      "Create an account to start buying and selling digital assets on our marketplace.",
  },
  twitter: {
    title: "Sign Up",
    description:
      "Create an account to start buying and selling digital assets on our marketplace.",
  },
};

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
