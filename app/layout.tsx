import React from "react"
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";

import "./globals.css";

const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});
const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Gigafy - Transform Into a GigaChad",
  description:
    "Upload your photo and transform it into the ultimate GigaChad version. Unleash your inner legend.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${_spaceGrotesk.variable} ${_inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
