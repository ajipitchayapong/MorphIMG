"use client";

import { useEffect, useState } from "react";
import { useImageStore, type ImageFormat } from "@/lib/image-store";
import { cn } from "@/lib/utils";
import { findOptimalQuality } from "@/lib/image-converter";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Settings2,
  Maximize2,
  Target,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";

const OUTPUT_FORMATS: {
  value: ImageFormat;
  label: string;
  lossy: boolean;
  description: string;
}[] = [
  {
    value: "webp",
    label: "WebP",
    lossy: true,
    description: "Best compression",
  },
  { value: "jpg", label: "JPG", lossy: true, description: "Universal" },
  { value: "png", label: "PNG", lossy: false, description: "Lossless" },
  { value: "avif", label: "AVIF", lossy: true, description: "Smallest files" },
];

const RATIO_PRESETS = [
  { label: "1:1", description: "Square", ratio: 1 },
  { label: "4:5", description: "IG Portrait", ratio: 4 / 5 },
  { label: "16:9", description: "Standard", ratio: 16 / 9 },
  { label: "9:16", description: "Story", ratio: 9 / 16 },
  { label: "4:3", description: "Classic", ratio: 4 / 3 },
  { label: "3:2", description: "Photo", ratio: 3 / 2 },
];

export function ConversionSettings() {
  const {
    settings,
    updateSettings,
    selectedFileIds,
    files,
    clearSelection,
    isConverting,
    isEstimating,
    setIsEstimating,
    supportedOutputFormats,
  } = useImageStore();

  const filteredOutputFormats = OUTPUT_FORMATS.filter((f) =>
    supportedOutputFormats.includes(f.value),
  );

  const selectedFormat = filteredOutputFormats.find(
    (f) => f.value === settings.outputFormat,
  );
  const isLossyFormat = selectedFormat?.lossy ?? true;
  const primarySelectedFile = files.find(
    (f) => f.id === selectedFileIds.at(-1),
  );

  const singleFile = files.length === 1 ? files[0] : null;
  const largestFile = [...files].sort(
    (a, b) => b.originalSize - a.originalSize,
  )[0];
  const targetFile = primarySelectedFile || largestFile || null;

  const applyRatio = (ratio: number) => {
    updateSettings({
      resizeMode: "fixed",
      resizeHeight: Math.round(settings.resizeWidth / ratio),
      maintainAspectRatio: true,
      lockedRatio: ratio,
    });
  };

  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);

  // Real-time quality estimation based on target file size
  useEffect(() => {
    if (
      !settings.targetFileSize ||
      settings.outputFormat === "png" ||
      isConverting ||
      !targetFile
    ) {
      setEstimatedSize(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsEstimating(true);
      try {
        const img = new Image();
        img.src = targetFile.preview;

        if (!img.complete) {
          await new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
            setTimeout(() => rej(new Error("Image load timeout")), 5000);
          });
        }

        const canvas = document.createElement("canvas");

        let targetWidth = img.width;
        let targetHeight = img.height;

        if (settings.resizeMode === "percentage") {
          targetWidth = Math.round(
            img.width * (settings.resizePercentage / 100),
          );
          targetHeight = Math.round(
            img.height * (settings.resizePercentage / 100),
          );
        } else if (settings.resizeMode === "fixed") {
          targetWidth = settings.resizeWidth;
          targetHeight = settings.resizeHeight;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (settings.outputFormat === "jpg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          }
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          const mimeType =
            settings.outputFormat === "jpg"
              ? "image/jpeg"
              : `image/${settings.outputFormat}`;
          const targetBytes = (settings.targetFileSize || 0) * 1024;

          const result = await findOptimalQuality(
            canvas,
            mimeType,
            targetBytes,
          );
          const newQuality = Math.round(result.quality * 100);

          setEstimatedSize(result.blob.size);

          if (newQuality !== settings.quality) {
            updateSettings({ quality: newQuality });
          }
        }
      } catch (error) {
        console.error("Estimation failed", error);
        setEstimatedSize(null);
      } finally {
        setIsEstimating(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [
    settings.targetFileSize,
    settings.resizePercentage,
    settings.resizeWidth,
    settings.resizeHeight,
    settings.outputFormat,
    settings.resizeMode,
    // Remove settings.quality from dependency to avoid loop when we calculate it ourselves
    // We only want to re-calculate if the TARGET changes, not if the RESULT changes
    targetFile?.id,
    targetFile?.preview,
    updateSettings,
    setIsEstimating,
    isConverting,
  ]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Settings2
            className="w-4 h-4 text-primary"
            suppressHydrationWarning
          />
          <h3 className="font-bold text-foreground text-base">Configuration</h3>
        </div>
        {selectedFileIds.length > 0 || singleFile ? (
          <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
            <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded-md overflow-hidden shrink min-w-0 max-w-[140px]">
              <div className="inline-block whitespace-nowrap group-hover:animate-marquee-slow w-full">
                <span className="text-[11px] font-bold text-primary block truncate">
                  {singleFile
                    ? singleFile.name
                    : selectedFileIds.length === 1
                      ? primarySelectedFile?.name
                      : `${selectedFileIds.length} Images`}
                </span>
              </div>
            </div>
            {selectedFileIds.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSelection}
                className="h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive"
                title="Clear Selection (Back to Batch Mode)"
              >
                <X className="w-3 h-3" strokeWidth={3} />
              </Button>
            )}
          </div>
        ) : (
          <div className="px-2 py-1 bg-muted rounded-md border border-border text-muted-foreground text-[10px] font-bold shrink-0">
            BATCH MODE
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(0);
          }
          90% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-slow {
          display: inline-block;
          padding-left: 0;
          animation: marquee 8s linear infinite alternate;
        }
      `}</style>

      <Tabs defaultValue="convert" className="w-full">
        <TabsList className="w-full grid grid-cols-2 rounded-none bg-muted/20 p-1">
          <TabsTrigger
            value="convert"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Convert
          </TabsTrigger>
          <TabsTrigger
            value="resize"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Resize
          </TabsTrigger>
        </TabsList>

        {/* Tab: Convert */}
        <TabsContent value="convert" className="p-4 space-y-4 m-0">
          <div className="space-y-4">
            {/* Output Format Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Output Format
              </Label>
              <Select
                value={settings.outputFormat}
                onValueChange={(value: ImageFormat) =>
                  updateSettings({ outputFormat: value })
                }
              >
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredOutputFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <span className="flex items-center gap-2">
                        {format.label}
                        <span className="text-xs text-muted-foreground">
                          ({format.description})
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quality Slider */}
            {isLossyFormat ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Quality
                  </Label>
                  <div className="flex items-center gap-1.5">
                    {isEstimating && (
                      <Loader2 className="w-3 h-3 animate-spin text-primary/60" />
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                        settings.targetFileSize
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      <span className="opacity-70 uppercase tracking-tighter">
                        {settings.targetFileSize ? "Auto" : "Quality"}
                      </span>
                      {settings.quality}%
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <Slider
                    disabled={settings.targetFileSize !== null}
                    value={[settings.quality]}
                    onValueChange={([value]) =>
                      updateSettings({ quality: value })
                    }
                    min={1}
                    max={100}
                    step={1}
                    className={cn(
                      "w-full transition-opacity duration-200",
                      settings.targetFileSize !== null && "opacity-50",
                    )}
                  />
                  {settings.targetFileSize !== null && (
                    <div className="absolute inset-0 z-10 cursor-not-allowed flex items-center justify-center">
                      <span className="text-[10px] font-medium bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-border shadow-sm text-muted-foreground">
                        Quality auto-adjusted for size
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Smaller File</span>
                  {settings.quality === 100 ? (
                    <span className="text-emerald-500 font-bold animate-pulse">
                      Maximum Quality
                    </span>
                  ) : (
                    <span>Better Quality</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  Lossless format selected. Quality optional is not available.
                </p>
              </div>
            )}

            {/* Target File Size */}
            <div className="pt-2 border-t border-border mt-4">
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="w-3.5 h-3.5" suppressHydrationWarning />
                    Target File Size (Max)
                  </Label>
                  <Switch
                    checked={settings.targetFileSize !== null}
                    disabled={!isLossyFormat}
                    onCheckedChange={(checked) =>
                      updateSettings({ targetFileSize: checked ? 500 : null })
                    }
                  />
                </div>
                {!isLossyFormat && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Target size is only available for lossy formats (JPG, WebP,
                    AVIF). For PNG, try resizing the image.
                  </p>
                )}
                {isLossyFormat && settings.targetFileSize !== null && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Input
                      type="number"
                      value={settings.targetFileSize}
                      onChange={(e) =>
                        updateSettings({
                          targetFileSize: Number(e.target.value),
                        })
                      }
                      min={10}
                      max={10000}
                      className="flex-1 h-8 text-sm"
                    />
                    <span className="text-xs text-muted-foreground font-medium">
                      KB
                    </span>
                  </div>
                )}
                {settings.targetFileSize !== null && (
                  <div className="flex justify-end">
                    {isEstimating ? (
                      <span className="text-[10px] text-muted-foreground animate-pulse">
                        Calculating best quality...
                      </span>
                    ) : estimatedSize ? (
                      <span className="text-[10px] text-muted-foreground">
                        Est:{" "}
                        <span
                          className={cn(
                            "font-bold",
                            estimatedSize >
                              (settings.targetFileSize || 0) * 1024
                              ? "text-amber-500"
                              : "text-emerald-500",
                          )}
                        >
                          {(estimatedSize / 1024).toFixed(1)} KB
                        </span>
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Resize */}
        <TabsContent value="resize" className="p-4 space-y-5 m-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1.5">
                <Maximize2 className="w-4 h-4" suppressHydrationWarning />
                Mode
              </Label>
              <Select
                value={settings.resizeMode}
                onValueChange={(value: "none" | "percentage" | "fixed") =>
                  updateSettings({ resizeMode: value })
                }
              >
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Scale</SelectItem>
                  <SelectItem value="fixed">Fixed Dimensions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.resizeMode === "percentage" && (
              <div className="space-y-3 pt-1 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Scale Factor
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={settings.resizePercentage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          updateSettings({
                            resizePercentage: Math.max(1, val),
                          });
                        }
                      }}
                      className="w-16 h-7 text-xs font-bold text-center p-0"
                    />
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="opacity-70 uppercase tracking-tighter">
                        Scale
                      </span>
                      {settings.resizePercentage}%
                    </span>
                  </div>
                </div>
                <Slider
                  value={[settings.resizePercentage]}
                  onValueChange={([value]) =>
                    updateSettings({ resizePercentage: value })
                  }
                  min={10}
                  max={500}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>10%</span>
                  <span>500%</span>
                </div>
              </div>
            )}

            {settings.resizeMode === "fixed" && (
              <div className="space-y-4 pt-1 animate-in fade-in zoom-in-95 duration-200">
                {/* Ratio Presets */}
                {/* Ratio Presets */}
                <div className="grid grid-cols-3 gap-2">
                  {RATIO_PRESETS.map((preset) => {
                    const currentRatio =
                      settings.resizeWidth / settings.resizeHeight;
                    const isActive =
                      Math.abs(currentRatio - preset.ratio) < 0.001 &&
                      settings.maintainAspectRatio;

                    return (
                      <Button
                        key={preset.label}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-auto py-2 flex flex-col gap-0.5 transition-all duration-200 border-emerald-500/20",
                          isActive
                            ? "shadow-md scale-[1.02] bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white"
                            : "hover:border-emerald-500/50 hover:bg-emerald-500/5",
                        )}
                        onClick={() => {
                          if (isActive) {
                            updateSettings({ maintainAspectRatio: false });
                          } else {
                            applyRatio(preset.ratio);
                          }
                        }}
                        title={preset.description}
                      >
                        <span
                          className={cn(
                            "text-[13px]",
                            isActive ? "font-bold" : "font-medium",
                          )}
                        >
                          {preset.label}
                        </span>
                        <span
                          className={cn(
                            "text-[10px]",
                            isActive
                              ? "text-primary-foreground font-bold"
                              : "text-muted-foreground",
                          )}
                        >
                          {preset.description}
                        </span>
                      </Button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-medium">
                      Width (px)
                    </Label>
                    <Input
                      type="number"
                      value={settings.resizeWidth}
                      onChange={(e) => {
                        const width = Number(e.target.value);
                        if (settings.maintainAspectRatio) {
                          const ratio =
                            settings.lockedRatio ||
                            settings.resizeWidth / settings.resizeHeight;
                          updateSettings({
                            resizeWidth: width,
                            resizeHeight: Math.round(width / ratio),
                            lockedRatio: ratio,
                          });
                        } else {
                          updateSettings({ resizeWidth: width });
                        }
                      }}
                      min={1}
                      max={10000}
                      className="h-8 text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-medium">
                      Height (px)
                    </Label>
                    <Input
                      type="number"
                      value={settings.resizeHeight}
                      onChange={(e) => {
                        const height = Number(e.target.value);
                        if (settings.maintainAspectRatio) {
                          const ratio =
                            settings.lockedRatio ||
                            settings.resizeWidth / settings.resizeHeight;
                          updateSettings({
                            resizeHeight: height,
                            resizeWidth: Math.round(height * ratio),
                            lockedRatio: ratio,
                          });
                        } else {
                          updateSettings({ resizeHeight: height });
                        }
                      }}
                      min={1}
                      max={10000}
                      className="h-8 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-muted/40 p-2 rounded-lg">
                  <Label className="text-xs text-muted-foreground">
                    Maintain Aspect Ratio
                  </Label>
                  <Switch
                    checked={settings.maintainAspectRatio}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        maintainAspectRatio: checked,
                        lockedRatio: checked
                          ? settings.resizeWidth / settings.resizeHeight
                          : null,
                      })
                    }
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-600"
                  />
                </div>
              </div>
            )}

            {settings.resizeMode === "none" && (
              <div className="p-4 bg-muted/30 rounded-lg border border-dashed border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Images will keep their original dimensions.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
