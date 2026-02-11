"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

export function AnalyticsWrapper() {
  const [consent, setConsent] = useState<{ analytics: boolean } | null>(null);

  useEffect(() => {
    // Check for the consent in localStorage
    const savedConsent = localStorage.getItem("cookie-consent-v2");
    if (savedConsent) {
      try {
        setConsent(JSON.parse(savedConsent));
      } catch (e) {
        console.error("Error parsing cookie consent", e);
      }
    }

    // Listen for storage changes (in case user updates settings in the modal)
    const handleStorageChange = () => {
      const updatedConsent = localStorage.getItem("cookie-consent-v2");
      if (updatedConsent) {
        setConsent(JSON.parse(updatedConsent));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for a custom event we can trigger when saving settings
    window.addEventListener("cookie-consent-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cookie-consent-updated", handleStorageChange);
    };
  }, []);

  // If user hasn't made a choice or declined analytics, don't load them
  if (!consent || !consent.analytics) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </>
  );
}
