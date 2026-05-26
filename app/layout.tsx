// app/layout.tsx

import type { Metadata } from "next";
import {
  Quicksand,
  Playfair_Display,
} from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "ScoopAura ✨ — Mystery Surprise Boxes",
  description:
    "Unbox the Aura of Mystery! Discover surprise scoops filled with cute aesthetic goodies, self-care items, accessories, and exclusive freebies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`
        ${quicksand.variable}
        ${playfair.variable}
      `}
    >
      <body className="antialiased">
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}