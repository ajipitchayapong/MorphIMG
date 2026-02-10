"use client";

import { Shield, Zap, Infinity, HardDrive, Wifi, Lock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Private",
    description:
      "Your files never leave your device. All processing happens locally in your browser.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Powered by WebAssembly for near-native performance. Convert files in seconds.",
  },
  {
    icon: Infinity,
    title: "Unlimited",
    description:
      "No file size limits, no daily caps. Convert as many images as you need.",
  },
  {
    icon: HardDrive,
    title: "No Storage Used",
    description:
      "We don't store any data. Everything is processed in memory and discarded.",
  },
  {
    icon: Wifi,
    title: "Works Offline",
    description:
      "Once loaded, the converter works without an internet connection.",
  },
  {
    icon: Lock,
    title: "Enterprise Ready",
    description:
      "Safe for sensitive documents, legal files, and confidential images.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 text-balance">
            Why choose HushPixel?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Built for professionals who value privacy and efficiency. No
            compromises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-xl p-6 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <feature.icon
                  className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                  suppressHydrationWarning
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
