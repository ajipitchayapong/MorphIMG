import React from "react";
import { Info, Mail, Heart, Globe } from "lucide-react";

export const metadata = {
  title: "About Us | HushPixel",
  description: "Learn more about the HushPixel mission and how to contact us.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
            <Info className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">About HushPixel</h1>
          <p className="text-muted-foreground text-lg">
            High-performance image tools with zero privacy compromise.
          </p>
        </div>

        <section className="grid gap-8">
          <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="w-6 h-6 text-emerald-500" /> Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              HushPixel was founded with a simple goal: to provide the world
              with the fastest, most reliable image conversion tools without
              ever asking users to trust us with their files. By leveraging
              modern browser technologies, we bring desktop-grade performance to
              your web browser.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-muted/50 border space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" /> Why HushPixel?
              </h2>
              <p className="text-muted-foreground">
                - **Privacy First:** Files stay in your RAM.
                <br />
                - **Unrivaled Speed:** Powered by WebAssembly.
                <br />- **Zero Cost:** No subscriptions or hidden fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-muted/50 border space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-500" /> Contact Us
              </h2>
              <p className="text-muted-foreground">
                Have feedback or encountered a bug? We'd love to hear from you.
              </p>
              <p className="font-medium">
                Email:{" "}
                <span className="text-emerald-500">
                  support@securepixel.com
                </span>
              </p>
            </div>
          </div>
        </section>

        <div className="pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 HushPixel Team. Made with passion for a safer web.
          </p>
        </div>
      </div>
    </div>
  );
}
