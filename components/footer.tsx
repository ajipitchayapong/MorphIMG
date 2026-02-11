"use client";

import { Shield, Heart, Coffee } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg
                viewBox="0 0 32 32"
                className="w-5 h-5 text-white fill-current"
                suppressHydrationWarning
              >
                <path d="M4 26V6h6l6 9 6-9h6v20h-5V12l-7 10.5-7-10.5V26H4z" />
              </svg>
            </div>
            <span className="font-semibold text-foreground">MorphIMG</span>
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
