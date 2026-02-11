"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Cookie,
  X,
  Settings,
  ShieldCheck,
  BarChart3,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    necessary: true,
    analytics: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent-v2");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      const savedSettings = JSON.parse(consent);
      setSettings(savedSettings);
    }
  }, []);

  const saveSettings = (newSettings: typeof settings) => {
    localStorage.setItem("cookie-consent-v2", JSON.stringify(newSettings));
    window.dispatchEvent(new Event("cookie-consent-updated"));
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true };
    setSettings(allAccepted);
    saveSettings(allAccepted);
  };

  const handleDeclineAll = () => {
    const allDeclined = { necessary: true, analytics: false };
    setSettings(allDeclined);
    saveSettings(allDeclined);
  };

  const handleSavePreferences = () => {
    saveSettings(settings);
  };

  if (!isVisible && !showSettings) return null;

  return (
    <>
      {isVisible && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-[0_8px_32px_rgba(37,99,235,0.15)] p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                <Cookie className="w-6 h-6" />
              </div>

              <div className="flex-1 text-center md:text-left space-y-1">
                <h3 className="font-bold text-foreground">
                  Cookie Preferences
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies to improve your experience. Choice is yours.
                  Read our{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-500 hover:text-blue-600 underline underline-offset-4 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="w-full sm:w-auto text-muted-foreground hover:text-blue-500 gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Customise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeclineAll}
                  className="w-full sm:w-auto border-blue-500/20 hover:bg-blue-500/5 text-muted-foreground"
                >
                  Reject All
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/20"
                >
                  Accept All
                </Button>
              </div>

              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[450px] border-blue-500/20 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              Cookie Settings
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Some cookies are essential for the
              site to function correctly.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-6">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  Strictly Necessary
                </div>
                <p className="text-xs text-muted-foreground">
                  Essential for the website to function. They cannot be switched
                  off.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-500/50 uppercase tracking-widest">
                  Always active
                </span>
                <Switch
                  checked
                  disabled
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                  Analytics & Statistics
                </div>
                <p className="text-xs text-muted-foreground">
                  Help us understand how visitors interact with the website to
                  improve performance.
                </p>
              </div>
              <Switch
                checked={settings.analytics}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, analytics: checked }))
                }
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between items-center gap-3">
            <Button
              variant="link"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-blue-500"
              onClick={() => {
                setShowSettings(false);
                setIsVisible(true);
              }}
            >
              <Link href="/privacy">View Privacy Policy</Link>
            </Button>
            <Button
              onClick={handleSavePreferences}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/20"
            >
              Save My Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
