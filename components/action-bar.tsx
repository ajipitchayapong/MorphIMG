"use client";

import { useImageStore, formatFileSize } from "@/lib/image-store";
import { Button } from "@/components/ui/button";
import { Zap, Download, Loader2, CheckCircle2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  convertImages,
  downloadAllAsZip,
  downloadSingleFile,
} from "@/lib/image-converter";

export function ActionBar() {
  const { files, isConverting, settings } = useImageStore();

  const hasFiles = files.length > 0;
  const pendingFiles = files.filter((f) => f.status === "pending");
  const completedFiles = files.filter((f) => f.status === "done");
  const convertingFiles = files.filter((f) => f.status === "converting");
  const canConvert = pendingFiles.length > 0 && !isConverting;
  const canDownload = completedFiles.length > 0;
  const allDone =
    pendingFiles.length === 0 && completedFiles.length > 0 && !isConverting;

  const subProgress = useImageStore((state) => state.subProgress);

  const progress =
    files.length > 0
      ? (completedFiles.length / files.length) * 100 +
        subProgress / files.length
      : 0;

  // Calculate total savings
  const totalOriginal = completedFiles.reduce(
    (sum, f) => sum + f.originalSize,
    0,
  );
  const totalConverted = completedFiles.reduce(
    (sum, f) => sum + (f.convertedSize || f.originalSize),
    0,
  );
  const totalSavings = totalOriginal - totalConverted;
  const savingsPercent =
    totalOriginal > 0 ? Math.round((totalSavings / totalOriginal) * 100) : 0;

  const handleConvert = async () => {
    await convertImages();
  };

  const handleDownload = async () => {
    if (completedFiles.length === 1) {
      const file = completedFiles[0];
      if (file.convertedBlob) {
        downloadSingleFile(file);
      }
    } else {
      await downloadAllAsZip(completedFiles);
    }
  };

  if (!hasFiles) return null;

  return (
    <div className="sticky bottom-4 z-10 mx-auto w-full">
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Animated Progress Bar Background */}
        {/* Status Area */}
        <div className="flex-1 flex flex-col gap-2.5 pl-1">
          {isConverting ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2
                    className="w-4 h-4 animate-spin text-emerald-500"
                    suppressHydrationWarning
                  />
                  <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Processing Your Images...
                  </span>
                </div>
                <span className="text-[10px] font-black text-emerald-600/80 dark:text-emerald-400/80 tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>

              <div
                className="relative w-full h-2.5 bg-muted/60 dark:bg-muted/30 rounded-full overflow-hidden border border-border/50"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-gradient-x transition-all duration-300 ease-linear"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  <div className="absolute inset-0 animate-shimmer opacity-40" />
                </div>
              </div>

              <span className="text-[9px] uppercase tracking-[0.15em] font-black text-muted-foreground/50">
                Converting {completedFiles.length + 1} of {files.length} images
              </span>
            </div>
          ) : allDone ? (
            <div className="flex items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2
                  className="w-5 h-5 text-emerald-500"
                  suppressHydrationWarning
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Success! Conversion Complete
                </span>
                {totalSavings > 0 && (
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/70">
                    Saved {formatFileSize(totalSavings)} ({savingsPercent}%)
                    total size
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Zap
                  className="w-4 h-4 text-muted-foreground"
                  suppressHydrationWarning
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">
                  {pendingFiles.length}{" "}
                  {pendingFiles.length === 1 ? "Image" : "Images"} Ready
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/70">
                  Select a format and press convert
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {canConvert && (
            <Button
              onClick={handleConvert}
              disabled={!canConvert}
              size="lg"
              className="flex-1 sm:flex-none h-11 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all border-0 font-bold group"
            >
              <Zap
                className="w-4 h-4 mr-2 group-hover:animate-pulse"
                suppressHydrationWarning
              />
              Convert to {settings.outputFormat.toUpperCase()}
            </Button>
          )}

          {canDownload && (
            <Button
              variant={allDone ? "default" : "outline"}
              onClick={handleDownload}
              size="lg"
              className={cn(
                "flex-1 sm:flex-none h-11 px-6 transition-all duration-300 font-bold",
                allDone
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] border-0"
                  : "bg-transparent border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              )}
            >
              {completedFiles.length > 1 ? (
                <>
                  <Package className="w-4 h-4 mr-2" suppressHydrationWarning />
                  Download ZIP
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" suppressHydrationWarning />
                  Download
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
