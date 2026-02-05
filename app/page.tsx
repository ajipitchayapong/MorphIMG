"use client";

import { Header } from "@/components/header";
import { DropZone } from "@/components/drop-zone";
import { FileList } from "@/components/file-list";
import { ConversionSettings } from "@/components/conversion-settings";
import { ActionBar } from "@/components/action-bar";
import { FeaturesSection } from "@/components/features-section";
import { FormatsSection } from "@/components/formats-section";
import { Footer } from "@/components/footer";
import { UserGuidelines } from "@/components/user-guidelines";
import { useImageStore } from "@/lib/image-store";
import { useEffect } from "react";

export default function Home() {
  const { files, checkBrowserSupport } = useImageStore();
  const hasFiles = files.length > 0;

  useEffect(() => {
    checkBrowserSupport();
  }, [checkBrowserSupport]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4">
            {!hasFiles && (
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-3 text-balance">
                  Convert images instantly.
                  <br />
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    100% private.
                  </span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto text-balance">
                  Convert, compress, and resize images entirely in your browser.
                  Your files never leave your device.
                </p>
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              {!hasFiles && <DropZone />}

              {hasFiles && (
                <div className="space-y-4">
                  <UserGuidelines />
                  {/* Main Content Grid */}
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                      <FileList />
                      <DropZone compact />
                    </div>
                    <div className="lg:col-span-1">
                      <ConversionSettings />
                    </div>
                  </div>

                  {/* Sticky Action Bar */}
                  <ActionBar />
                </div>
              )}
            </div>
          </div>
        </section>

        {!hasFiles && (
          <>
            <FeaturesSection />
            <FormatsSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
