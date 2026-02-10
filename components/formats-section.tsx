"use client";

import { ArrowRight } from "lucide-react";
import { useImageStore } from "@/lib/image-store";

const inputFormats = [
  "JPG",
  "PNG",
  "WEBP",
  "GIF",
  "HEIC",
  "AVIF",
  "TIFF",
  "BMP",
];

const OUTPUT_FORMAT_CONFIG = ["JPG", "PNG", "WEBP", "AVIF"];

export function FormatsSection() {
  const filteredOutputFormats = OUTPUT_FORMAT_CONFIG;

  return (
    <section id="formats" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 text-balance">
            Supported Formats
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Convert between all major image formats including the latest HEIC
            and AVIF.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Input Formats */}
            <div className="flex-1 w-full">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                Input Formats
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {inputFormats.map((format) => (
                  <span
                    key={format}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ArrowRight
                  className="w-6 h-6 text-white"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Output Formats */}
            <div className="flex-1 w-full">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                Output Formats
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {filteredOutputFormats.map((format) => (
                  <span
                    key={format}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/20"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
