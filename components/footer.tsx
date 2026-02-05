"use client";

import { Shield, Heart } from "lucide-react";
import { useImageStore } from "@/lib/image-store";

export function Footer() {
  const { supportedOutputFormats } = useImageStore();
  const isWebPSupported = supportedOutputFormats.includes("webp");

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield
                className="w-5 h-5 text-primary-foreground"
                suppressHydrationWarning
              />
            </div>
            <span className="font-semibold text-foreground">SecurePixel</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a
              href="/heic-to-jpg"
              className="hover:text-foreground transition-colors"
            >
              HEIC to JPG
            </a>
            {isWebPSupported && (
              <a
                href="/png-to-webp"
                className="hover:text-foreground transition-colors"
              >
                PNG to WebP
              </a>
            )}
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
