"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
