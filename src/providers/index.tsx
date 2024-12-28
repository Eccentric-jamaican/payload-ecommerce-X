"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import { NotificationsProvider } from "./NotificationsProvider";
import { WishlistProvider } from "./WishlistProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        <AuthProvider>
          <NotificationsProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </NotificationsProvider>
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
