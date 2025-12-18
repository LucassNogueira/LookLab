import React from "react";

// Libraries
import { Syne, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";

// Components
import { Providers } from "./providers";

// Utils
import "./globals.css";

// Types
import type { Metadata } from "next";

const syne = Syne({
  subsets: ["latin"],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
});

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
      <body className={`${syne.variable} ${dmSans.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>
          {children}
          <Toaster position="bottom-center" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
