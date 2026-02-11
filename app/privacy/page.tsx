import React from "react";
import { Shield, Lock, Eye, Cookie, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | MorphIMG",
  description:
    "Learn how MorphIMG protects your privacy and handles your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto mb-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-blue-500 transition-colors"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: February 10, 2026
          </p>
        </div>

        <section className="space-y-6">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border shadow-sm">
            <div className="mt-1">
              <Lock className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                Privacy First: Local Processing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                MorphIMG is built on a "Privacy First" principle. Unlike regular
                converters, your images are **never uploaded to our servers**.
                All conversion, resizing, and processing happens directly in
                your browser using WebAssembly.
              </p>
            </div>
          </div>

          <div className="space-y-4 px-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="w-6 h-6" /> Data Collection
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Since processing happens locally, we do not collect your personal
              images, metadata, or sensitive information. We do not require
              account registration to use our basic tools.
            </p>

            <h2 className="text-2xl font-bold flex items-center gap-2 pt-4">
              <Cookie className="w-6 h-6" /> Cookies & Analytics
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use standard analytics tools to understand how people use our
              site and to improve our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                **Vercel Analytics & Speed Insights:** To monitor site
                performance and crashes.
              </li>
              <li>
                **Google Analytics (GA4):** To track general visitor patterns
                and traffic sources.
              </li>
              <li>
                **Google AdSense:** When enabled, Google may use cookies to
                serve relevant ads based on your visit history.
              </li>
            </ul>

            <h2 className="text-2xl font-bold pt-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to visit our site without tracking by using "Do
              Not Track" browser settings or ad-blockers. As we don't store
              personal identity data, there is no data for us to delete upon
              request beyond standard web server logs.
            </p>
          </div>
        </section>

        <div className="pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            If you have any questions about this policy, please contact us
            through our About page.
          </p>
        </div>
      </div>
    </div>
  );
}
