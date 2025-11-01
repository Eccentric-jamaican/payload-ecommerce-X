"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { NotificationsProvider } from "./NotificationsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NotificationsProvider>{children}</NotificationsProvider>
    </ThemeProvider>
  );
}
