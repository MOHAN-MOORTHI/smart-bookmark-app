import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Bookmarks | Your Digital Library",
  description: "A modern, secure, and real-time bookmark manager for organizing your digital life.",
  keywords: ["bookmarks", "manager", "supabase", "nextjs", "realtime", "productivity"],
  authors: [{ name: "Smart Bookmark Team" }],
  themeColor: "#030712",
  openGraph: {
    title: "Smart Bookmarks",
    description: "Your personal, synchronized bookmark collection.",
    url: "https://smart-bookmark-app-sooty.vercel.app",
    siteName: "Smart Bookmarks",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
