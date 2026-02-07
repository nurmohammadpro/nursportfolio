"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import ThemeProvider from "./ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--text-main)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-body)",
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
