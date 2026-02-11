"use client";

import { Info, MousePointer2, Layers, Bookmark, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/lib/image-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export function UserGuidelines() {
  const {
    files,
    selectedFileIds,
    saveSettingsAsDefault,
    clearSavedSettings,
    isPersistenceEnabled,
    togglePersistence,
  } = useImageStore();
  const isAnySelected = selectedFileIds.length > 0;

  if (files.length === 0) return null;

  return (
    <div className="space-y-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selection Tip */}
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
            isAnySelected
              ? "bg-blue-500/5 border-blue-500/20"
              : "bg-muted/30 border-border",
          )}
        >
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <MousePointer2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground mb-1">
                Individual Mode
              </h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Click an image in the list to configure it{" "}
                <span className="text-blue-500 font-medium">individually</span>.
                The configuration panel will light up to show which file you're
                editing.
              </p>
            </div>
          </div>
        </div>

        {/* Batch Tip */}
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
            !isAnySelected
              ? "bg-indigo-500/5 border-indigo-500/20"
              : "bg-muted/30 border-border",
          )}
        >
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground mb-1">
                Batch Mode
              </h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Deselect or don't pick a file to enter{" "}
                <span className="text-indigo-500 font-medium">Batch Mode</span>.
                Any settings you change will apply to{" "}
                <span className="italic">all images</span> in your list at once.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Persistence Configuration */}
      <div className="flex items-center justify-between gap-4 p-4 bg-primary/[0.03] border border-primary/10 rounded-xl transition-all hover:bg-primary/[0.05]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Bookmark className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-foreground">
              Personalized Experience
            </h4>
            <p className="text-[12px] text-muted-foreground">
              Automatically remember your settings for future conversions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border/50">
            <Checkbox
              id="persistence-toggle"
              checked={isPersistenceEnabled}
              onCheckedChange={(checked) => {
                const isEnabled = checked === true;
                togglePersistence(isEnabled);
                if (isEnabled) {
                  toast.success("Settings saved!", {
                    description: "We'll remember these for your next visit.",
                  });
                } else {
                  toast.info("Settings reset", {
                    description: "Back to system defaults for next session.",
                  });
                }
              }}
            />
            <Label
              htmlFor="persistence-toggle"
              className="text-xs font-bold cursor-pointer select-none text-foreground"
            >
              Remember My Settings
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
