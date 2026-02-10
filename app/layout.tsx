import React from "react";
import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://securepixel.com"),
  title: {
    default: "HushPixel - Free Online Image Converter | Privacy First",
    template: "%s | HushPixel",
  },
  description:
    "Convert images instantly in your browser. 100% private - no uploads to servers. Support for HEIC, AVIF, JXL, PNG, JPG, WEBP and more. Unlimited file size, unlimited conversions.",
  keywords: [
    "image converter",
    "HEIC to JPG",
    "PNG to WEBP",
    "image compression",
    "privacy",
    "browser-based",
    "offline converter",
    "secure image converter",
    "free image converter",
  ],
  authors: [{ name: "HushPixel Team" }],
  creator: "HushPixel",
  publisher: "HushPixel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hushpixel.com",
    title: "HushPixel - Free Online Image Converter | Privacy First",
    description:
      "Convert images instantly in your browser. 100% private - no uploads to servers. Support for HEIC, AVIF, JXL, PNG, JPG, WEBP and more.",
    siteName: "HushPixel",
    images: [
      {
        url: "/og-image.jpg", // We should probably add an OG image later
        width: 1200,
        height: 630,
        alt: "HushPixel - privacy first image converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HushPixel - Free Online Image Converter | Privacy First",
    description:
      "Convert images instantly in your browser. 100% private - no uploads to servers.",
    images: ["/og-image.jpg"], // Same as OG
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "HushPixel",
                url: "https://securepixel.com",
                description:
                  "Convert images instantly in your browser. 100% private - no uploads to servers.",
                applicationCategory: "MultimediaApplication",
                operatingSystem: "Any",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                featureList:
                  "Convert HEIC, AVIF, JXL, PNG, JPG, WEBP; Compress images; Resize images; Offline capable",
              }),
            }}
          />
          <Toaster />
          <Script
            src="https://cdn.jsdelivr.net/npm/heic-to@1.4.2/dist/iife/heic-to.js"
            strategy="beforeInteractive"
          />
          <Analytics />
          <SpeedInsights />
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
