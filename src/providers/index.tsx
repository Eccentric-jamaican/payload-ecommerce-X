"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./AuthProvider";
import { NotificationsProvider } from "./NotificationsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <NotificationsProvider>{children}</NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
