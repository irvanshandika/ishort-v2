/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/components/theme-provider";
import { UserProvider } from "@/src/hooks/useUser";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: {
    default: "iShort - Fast & Reliable URL Shortener",
    template: "%s | iShort",
  },
  description: "Transform your long URLs into short, shareable links in seconds. Professional URL shortening service with analytics, custom domains, and enterprise features.",
  keywords: "URL shortener, link shortener, short links, custom domains, analytics, QR codes",
  authors: [{ name: "iShort Team" }],
  creator: "iShort",
  publisher: "iShort",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ishort.ly",
    title: "iShort - Fast & Reliable URL Shortener",
    description: "Transform your long URLs into short, shareable links in seconds. Professional URL shortening service with analytics, custom domains, and enterprise features.",
    siteName: "iShort",
  },
  twitter: {
    card: "summary_large_image",
    title: "iShort - Fast & Reliable URL Shortener",
    description: "Transform your long URLs into short, shareable links in seconds. Professional URL shortening service with analytics, custom domains, and enterprise features.",
    creator: "@ishort",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-open-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <Toaster position="top-right" />
            {children}
            <GoogleAnalytics gaId="G-GHCHMVJH3X" />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
