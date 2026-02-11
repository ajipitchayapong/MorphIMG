import React from "react";
import { Info, Mail, Heart, Globe, Coffee } from "lucide-react";

export const metadata = {
  title: "About Us | MorphIMG",
  description: "Learn more about the MorphIMG mission and how to contact us.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About MorphIMG</h1>
          <p className="text-muted-foreground text-lg">
            High-performance image tools with zero privacy compromise.
          </p>
        </div>

        <section className="grid gap-8">
          <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-500" /> Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              MorphIMG was founded with a simple goal: to provide the world with
              the fastest, most reliable image conversion tools without ever
              asking users to trust us with their files. By leveraging modern
              browser technologies, we bring desktop-grade performance to your
              web browser.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-muted/50 border space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" /> Why MorphIMG?
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
                <Mail className="w-5 h-5 text-blue-500" /> Contact Us
              </h2>
              <p className="text-muted-foreground">
                Have feedback or encountered a bug? We'd love to hear from you.
              </p>
              <p className="font-medium text-sm">
                Email:{" "}
                <span className="text-blue-500">support@morphimg.com</span>
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500">
              <Coffee className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Support our mission</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                MorphIMG is free and forever will be. If you find our tools
                helpful, consider supporting our development costs by buying us
                a coffee.
              </p>
            </div>
            <a
              href="https://ko-fi.com/ajioh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Coffee className="w-5 h-5" />
              Support on Ko-fi
            </a>
          </div>
        </section>

        <div className="pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 MorphIMG Team. Made with passion for a safer web.
          </p>
        </div>
      </div>
    </div>
  );
}
