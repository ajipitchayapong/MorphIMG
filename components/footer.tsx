"use client";

import { Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg
                viewBox="0 0 32 32"
                className="w-5 h-5 text-white fill-current"
                suppressHydrationWarning
              >
                <path d="M8 6h4v20H8V6z" />
                <path d="M20 6h4v20h-4V6z" />
                <path d="M12 14h8v4h-8v-4z" />
                <rect x="14" y="22" width="4" height="4" opacity="0.6" />
              </svg>
            </div>
            <span className="font-semibold text-foreground">HushPixel</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a
              href="/heic-to-jpg"
              className="hover:text-foreground transition-colors"
            >
              HEIC to JPG
            </a>
            <a
              href="/png-to-webp"
              className="hover:text-foreground transition-colors"
            >
              PNG to WebP
            </a>
            <a
              href="/compress-image"
              className="hover:text-foreground transition-colors"
            >
              Compress Image
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart
              className="w-4 h-4 text-destructive fill-destructive"
              suppressHydrationWarning
            />
            <span>for privacy</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
          <a href="/about" className="hover:text-foreground transition-colors">
            About & Contact
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            All processing happens in your browser. Your files never touch our
            servers.
          </p>
        </div>
      </div>
    </footer>
  );
}
