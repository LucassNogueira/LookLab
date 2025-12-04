import React from "react";

// Libraries
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

// Components
import { Providers } from "./providers";

// Utils
import "./globals.css";

// Types
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LookLab",
  description: "AI-powered wardrobe manager and outfit generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="bottom-center" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
